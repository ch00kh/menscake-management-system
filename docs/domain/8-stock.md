# 8. 재고

마지막 도메인입니다. **테이블은 4번에서 이미 만들었습니다** — `stock_ledger`와 `stock`.
여기서는 셋을 맡습니다.

```
조회   왜 이 숫자인지 답한다
실사   실물을 세어 시스템과 대조한다
조정   차이와 사고(파손·분실)를 원장에 기록한다
```

경계는 [scope.md](scope.md) 3장에서 닫아뒀습니다. 용어는 [glossary.md](glossary.md).

---

## 1. 결정

| # | 정한 것 | 값 |
|---|---|---|
| 1 | 실사 중 입출고 | **계속 받는다.** 기준 시각의 시스템 값과 비교 |
| 2 | 안전재고 | **넣는다.** 미달하면 「발주 필요」에 뜬다 |

### 1.1 물어보지 않고 정한 것

**조정 전표에는 사유가 필수입니다.** 실사에서 나온 조정은 실사 전표 자체가 근거지만,
단건 조정은 왜 숫자를 바꿨는지가 없으면 그 조정이 곧 새로운 미스터리가 됩니다.

**세트는 재고 계산에서 제외합니다.** 자기 재고를 갖지 않으므로
([2-product.md](2-product.md) 2.7) 실사 대상도 안전재고 대상도 아닙니다. 세트의
판매 가능 수량은 저장하지 않고 `min(구성품 재고 ÷ 구성 수량)`으로 계산합니다.

---

## 2. 실사

### 2.1 기준 시각이 핵심입니다

아침 9시에 세고 오후 2시에 확정하면, 그 사이 출고분을 어떻게 처리할지가 문제입니다.

```
9시   실물을 세니 20개.  기준 시각의 시스템 값은 22개
11시  3개 출고            원장에 −3
14시  실사 확정           차이 = 20 − 22 = −2 를 원장에 기록 (moved_at = 9시)
```

현재고 = 22 − 3 − 2 = **17**.
실제로도 9시에 20개였다가 3개 나갔으니 **17**입니다. 맞습니다.

**출고를 멈추지 않아도 되는 이유가 이겁니다.** 세는 동안 일어난 이동은 이미 원장에
있으므로, 우리가 기록할 것은 **기준 시각에서의 차이 하나뿐**입니다.

`moved_at`을 확정 시각이 아니라 **기준 시각**으로 적는 이유는 시점별 재고 조회 때문입니다.
14시로 적으면 "9시에 재고가 몇이었나"가 틀리게 나옵니다.

### 2.2 실사 `stocktaking`

```
id              BIGINT        PK
stocktaking_no  VARCHAR       업무번호. 고유. ST-YYYY-0001
warehouse_id    BIGINT        FK → warehouse
base_at         TIMESTAMPTZ   기준 시각
scope           ENUM          FULL | PARTIAL
status          ENUM          DRAFT | CONFIRMED | CANCELED
confirmed_at    TIMESTAMPTZ   NULL 허용
confirmed_by    BIGINT        NULL 허용. account.id
memo            TEXT          NULL 허용
+ 감사 컬럼 5종
```

`scope` 표시 매핑 — 전체 · 일부.

**전체 실사와 순환 실사가 같은 전표입니다.** 대상 범위만 다릅니다. 전체는 정기적으로
창고 전부를, 일부는 7번에서 넘어온 「재고 확인 필요」 몇 개만 셉니다. 구조가 같으니
화면도 하나입니다.

### 2.3 실사라인 `stocktaking_line`

```
id                   BIGINT         PK
stocktaking_id       BIGINT         FK → stocktaking
line_no              INT
variant_id           BIGINT         FK → product_variant
lot_id               BIGINT         FK → lot. NULL 허용
system_quantity      DECIMAL(18,3)  기준 시각의 시스템 값. 전표 생성 시 복사
counted_quantity     DECIMAL(18,3)  NULL 허용. 센 값. NULL 이면 아직 안 셈
difference_quantity  DECIMAL(18,3)  counted_quantity − system_quantity
counted_at           TIMESTAMPTZ    NULL 허용
counted_by           BIGINT         NULL 허용. account.id
memo                 VARCHAR        NULL 허용
+ 감사 컬럼 5종
UNIQUE (stocktaking_id, variant_id, lot_id)
```

**`system_quantity`는 전표를 만들 때 복사해 저장합니다.** 원장에서 다시 계산할 수도
있지만, 저장해두면 **"그때 시스템이 뭐라고 했는지"** 가 그대로 남습니다. 나중에
차이를 따질 때 이 값이 근거입니다.

`counted_quantity`가 `NULL`인 것과 `0`인 것은 다릅니다. `NULL`은 **아직 안 셌다**,
`0`은 **세어보니 없다**입니다. 전체 실사에서 이 구분이 없으면 안 센 것이 조용히
전량 손실로 조정됩니다.

> `lot_id`가 NULL일 수 있어 유니크가 DB마다 다르게 동작합니다.
> [TODO.md](../../TODO.md) 4단계의 부분 유니크 항목에 추가했습니다.

### 2.4 확정할 때

```
1. counted_quantity 가 NULL 인 라인이 있으면 경고. 확정은 가능하되 그 라인은 건너뛴다
2. difference_quantity 가 0 이 아닌 라인마다 stock_ledger 에 행 기록
     quantity     = difference_quantity  (부호 있음)
     moved_at      = base_at
     source_type   = STOCKTAKING
3. stock 갱신
4. status = CONFIRMED
```

취소는 4번·7번과 같습니다 — 반대 부호 행을 쓰고 원본은 남깁니다.

---

## 3. 조정 `stock_adjustment`

실사 없이 단건으로 바로잡을 때 씁니다. 박스를 떨어뜨렸거나, 창고 구석에서 물건이
나왔거나.

```
stock_adjustment
  id             BIGINT        PK
  adjustment_no  VARCHAR       업무번호. 고유. AJ-YYYY-0001
  warehouse_id   BIGINT        FK → warehouse
  adjusted_date  DATE          조정일
  reason_code    ENUM          DAMAGE | LOSS | FOUND | RETURN | OTHER
  status         ENUM          DRAFT | CONFIRMED | CANCELED
  confirmed_at   TIMESTAMPTZ   NULL 허용
  confirmed_by   BIGINT        NULL 허용
  memo           TEXT          reason_code 가 OTHER 면 필수
  + 감사 컬럼 5종

stock_adjustment_line
  id             BIGINT         PK
  adjustment_id  BIGINT         FK → stock_adjustment
  line_no        INT
  variant_id     BIGINT         FK → product_variant
  lot_id         BIGINT         FK → lot. NULL 허용
  quantity       DECIMAL(18,3)  부호 있음. + 는 늘고 − 는 줄임
  memo           VARCHAR        NULL 허용
  + 감사 컬럼 5종
```

`reason_code` 표시 매핑 — 파손 · 분실 · 발견 · 반품입고 · 기타.

**`OTHER`를 고르면 메모가 필수입니다.** 사유 목록에 없는 일은 생기지만, 그걸 설명
없이 넘기면 6개월 뒤에 아무도 못 읽습니다.

확정하면 원장에 `source_type = ADJUSTMENT` 행이 쓰입니다. `moved_at`은 `adjusted_date`
기준입니다.

---

## 4. 안전재고

`product_variant`에 컬럼 하나가 붙습니다.

```
safety_stock  DECIMAL(18,3)  NULL 허용. NULL 이면 관리하지 않음
```

**「발주 필요」 판정**

```
판매 가능 창고(sellable = true)의 현재고 합계 < safety_stock
AND variant.active = true
AND product.sell_status = SELLING
AND variant.is_set = false
```

`NULL`을 허용한 이유는 전부 채우라고 강요하면 아무 숫자나 들어가기 때문입니다. 대신
재고 현황 화면에 **「기준 미설정」 필터**를 둬서, 잘 나가는 상품인데 기준이 없는 걸
찾을 수 있게 합니다.

이 목록이 4번 발주로 이어집니다. **지금은 주문이 들어와 품절을 확인하고서야
발주하는데**, 그보다 앞에서 잡는 게 이 화면의 목적입니다.

---

## 5. 다른 도메인에 생기는 변화

| 문서 | 변화 |
|---|---|
| [2-product.md](2-product.md) | `product_variant`에 `safety_stock` 추가 |
| [4-receiving.md](4-receiving.md) | `stock_ledger.source_type` 을 4개로 확장 |

`source_type`이 넷이 됐습니다.

```
RECEIVING    입고    4번
SHIPPING     출고    7번
STOCKTAKING  실사    8번
ADJUSTMENT   조정    8번
```

실사와 조정을 나눈 이유는 **근거 문서가 다르기 때문**입니다. 실사 차이는 세어본
결과이고 조정은 사람이 사유를 적은 것입니다. 하나로 합치면 원장에서 그 둘을 구분할
수 없습니다.

---

## 6. 채번 규칙

```
stocktaking_no   ST-YYYY-0001   연도별 리셋
adjustment_no    AJ-YYYY-0001   연도별 리셋
```

---

## 7. 화면

| 화면 | 레이아웃 | 구성 |
|---|---|---|
| 재고 현황 | **2** 좌측 필터 패널 목록 | 카테고리 트리 + 창고 · 음수 · 기준 미설정 필터 |
| **재고 이동 내역** | **3** 상세 조회 목록 | 원장 조회. **왜 이 숫자인지에 답하는 화면** |
| 재고 알림 | **4** 상태별 탭 목록 | 재고 확인 필요 · 발주 필요 · 기한 임박 |
| 실사 목록 | **4** 상태별 탭 목록 | 작성중 · 확정 · 취소 |
| 실사 전표 | **17** 전표 입력 | 헤더(창고 · 기준시각) + 라인(시스템값 · 센값 · 차이) |
| 재고 조정 | **17** 전표 입력 | 헤더(사유) + 라인 |

### 7.1 재고 이동 내역이 이 프로젝트의 결론입니다

통장 비유를 처음 꺼낸 게 4번이었습니다. **이 화면이 그 거래내역입니다.**

```
9/1  입고    빨강L  +10   RC-2026-0031
9/3  출고    빨강L   −3   SH-2026-0104
9/5  실사    빨강L   −1   ST-2026-0002
                    ────
                      6
```

한 줄마다 전표번호가 붙어 있어 눌러서 원본으로 갑니다. "빨강L이 왜 6개죠?"에 화면이
답합니다 — **디스코드를 뒤지지 않고.**

설계 리트머스가 요구한 게 이것입니다.

> 디스코드 스크롤백 없이, 처음 보는 야간 담당자가 화면만 보고
> 지금 뭘 해야 하는지 정확히 아는가?

### 7.2 실사 전표의 라인 그리드

세 칸이 나란히 있습니다.

```
시스템값(읽기 전용)   센 값(입력)   차이(자동)
```

차이가 0이 아닌 줄만 색으로 구분하고, **안 센 줄(`NULL`)은 또 다른 색**입니다.
확정 버튼 옆에 "안 센 줄 N건"을 항상 띄웁니다.

---

### 7.3 「기한 임박」은 9번으로 이어집니다

재고 알림의 기한 임박 탭에서 골라 **기부 전표 또는 폐기 전표**를 바로 만듭니다.
기한이 남았으면 기부, 지났으면 폐기가 기본값입니다
→ [9-disposal.md](9-disposal.md) 6장.

---

## 8. 다음

9번 **기부 · 폐기**. 기한 임박 재고를 밖으로 내보내는 곳입니다.
