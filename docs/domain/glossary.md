# 용어사전

업무용어(한글) ↔ 식별자(영문)의 **1:1 등록부**입니다. 번역이 아니라 지정입니다 —
여기 등록된 값만 씁니다. 규칙은 [convention/core.md](../convention/core.md) 1장.

**사전에 없는 업무용어는 코드에 쓰기 전에 여기 먼저 추가합니다.** 도메인을 하나 설계할
때마다 그 도메인의 용어를 아래에 붙입니다.

> **표기는 `snake_case`가 정본입니다.** DB 물리명이 그대로 여기 들어옵니다.
> Java 필드와 TypeScript 속성은 이걸 camelCase로 바꾼 것이고, 변환은 기계적이라
> 사전에 따로 적지 않습니다 (`sales_order_no` ↔ `salesOrderNo`).
> 근거는 [convention/stack.md](../convention/stack.md) 3장.

---

## 공통

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 등록 시각 | `created_at` | 감사 컬럼 |
| 등록자 | `created_by` | 감사 컬럼. `account.id` |
| 수정 시각 | `updated_at` | 감사 컬럼 |
| 수정자 | `updated_by` | 감사 컬럼 |
| 삭제 시각 | `deleted_at` | 논리 삭제. `NULL` 이면 살아 있음 |
| 사용 여부 | `active` | 기준정보의 사용/미사용 |
| 정렬 순서 | `sort_order` | |
| 코드 | `code` | 사람이 부르는 불변 키. 접두를 붙여 씀 (`menu_code`) |
| 번호 | `no` | 채번된 업무번호 (`voucherNo`). 부정(不)이 아님 |

## 1. 사용자 · 권한

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 사용자 | `account` | 로그인하는 사람 |
| 로그인 아이디 | `login_id` | 관리자가 발급. 고유·불변 |
| 비밀번호 | `password` | 저장 컬럼은 `password_hash` |
| 최종 로그인 시각 | `last_login_at` | |
| 역할 | `role` | 권한 묶음 |
| 역할 코드 | `role_code` | 불변 키 |
| 사용자 역할 | `account_role` | 사용자 ↔ 역할 배정 (N:M) |
| 메뉴 | `menu` | 사이드바 한 줄. 권한이 붙는 단위 |
| 메뉴 코드 | `menu_code` | 불변 키. 권한이 이걸 가리킴 |
| 상위 메뉴 | `parent_id` | 자기참조. `NULL` 이면 최상위 |
| 화면 경로 | `path` | `NULL` 이면 폴더 메뉴 |
| 권한 | `permission` | (역할, 메뉴, 행위) 한 줄 |
| 역할 메뉴 권한 | `role_menu_permission` | 권한 테이블 |
| 행위 | `action` | `READ` `CREATE` `UPDATE` `DELETE` |
| 조회 | `READ` | 행위 코드값 |
| 등록 | `CREATE` | 행위 코드값 |
| 수정 | `UPDATE` | 행위 코드값 |
| 삭제 | `DELETE` | 행위 코드값 |
| 유효 권한 | `effectivePermission` | 사용자가 가진 모든 역할 권한의 합집합 |

## 2. 상품

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 상품 | `product` | 옵션을 묶는 윗단위. 재고가 붙는 곳이 아님 |
| 상품 코드 | `product_code` | 업무코드. 고유·불변 |
| 판매 상태 | `sell_status` | `SELLING` `STOPPED` `DISCONTINUED` |
| 판매중 | `SELLING` | 코드값 |
| 판매중지 | `STOPPED` | 코드값. 재고는 남아 있음 |
| 단종 | `DISCONTINUED` | 코드값. 소진 후 정리 |
| 상품 분류 | `product_category` | 계층. 상품은 말단 하나에만 속함 |
| 분류 코드 | `category_code` | 불변 키 |
| 태그 | `tag` | 겹치는 묶음. 등록된 것만 붙임 |
| 상품 태그 | `product_tag` | 상품 ↔ 태그 (N:M) |
| 옵션명 | `option_name` | 색상 · 사이즈. 전역 마스터 |
| 옵션값 | `option_value` | 빨강 · L. 옵션명에 속함 |
| 상품 옵션 | `product_option` | 이 상품이 쓰는 옵션명과 순서 |
| 옵션조합 | `product_variant` | **SKU.** 재고·입고·주문이 참조하는 단위 |
| SKU 코드 | `sku_code` | 업무코드. 전역 고유·불변 |
| 조합 표시명 | `option_label` | "빨강 / L". 옵션값에서 생성한 중복 컬럼 |
| 조합 옵션값 | `product_variant_value` | 조합 ↔ 옵션값 |
| 바코드 | `barcode` | 조합 단위. 실사에서 씀 |
| 세트 여부 | `is_set` | true 면 자기 재고를 갖지 않음 |
| 세트 구성 | `product_set_item` | 세트 SKU ↔ 구성품 SKU × 수량 |
| 구성품 | `component_variant_id` | 세트를 이루는 조합 |
| 수량 | `quantity` | `DECIMAL(18,3)` |

## 3. 거래처

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 거래처 | `partner` | 매입처 · 매출처를 함께 담음 |
| 거래처 코드 | `partner_code` | 업무코드. 고유·불변 |
| 거래처 구분 | `partner_type` | `PURCHASE` `SALES` `BOTH` |
| 매입처 | `PURCHASE` | 코드값. 물건을 사오는 상대 |
| 매출처 | `SALES` | 코드값. B2B 직판이 생기면 씀 |
| 양쪽 | `BOTH` | 코드값 |
| 사업자등록번호 | `business_no` | NULL 허용. 있으면 고유. 숫자 10자리로 정규화 |
| 사용 여부 | `active` | false 면 거래 종료 |
| 미사용 전환 시각 | `inactive_at` | 개인정보 파기 기산일 |
| 거래처 담당자 | `partner_contact` | **물리 삭제 대상.** `deleted_at` 없음 |
| 담당자 역할 | `contact_role` | `ORDER` `SETTLEMENT` `ETC` |
| 발주 담당 | `ORDER` | 코드값 |
| 정산 담당 | `SETTLEMENT` | 코드값 |
| 대표 담당자 | `is_primary` | |
| 담당자 보관 기간 | `partnerContactRetentionYears` | 설정값. 기본 3 |

## 4. 입고

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 창고 | `warehouse` | 지금은 「기본창고」 한 행만 |
| 기본 창고 | `is_default` | 전표의 기본 선택값 |
| 판매 가능 | `sellable` | false 면 판매 가능 재고에서 뺌 (반품창고) |
| 로트 | `lot` | `product.use_lot` 이 켜진 상품만 |
| 로트 번호 | `lot_no` | 입력 없으면 입고일자 + 순번 |
| 사용기한 | `expiry_date` | `DATE` |
| 제조일 | `manufactured_date` | `DATE` |
| 로트 관리 여부 | `use_lot` | `product` 컬럼 |
| 발주 | `purchase_order` | 도매상에 주문한 기록 |
| 발주번호 | `purchase_order_no` | `PO-YYYY-0001`. 연도별 리셋 |
| 발주 라인 | `purchase_order_line` | |
| 발주 수량 | `order_quantity` | |
| 입고된 수량 | `received_quantity` | 발주 라인의 캐시 |
| 미입고 수량 | — | `order_quantity - received_quantity`. 저장하지 않음 |
| 발주일 | `order_date` | `DATE` |
| 입고 예정일 | `expected_date` | `DATE` |
| 작성중 | `DRAFT` | 코드값. 재고에 영향 없음 |
| 발주됨 | `ORDERED` | 코드값 |
| 부분입고 | `PARTIAL` | 코드값. 계산되는 값 |
| 입고완료 | `COMPLETED` | 코드값. 계산되는 값 |
| 취소 | `CANCELED` | 코드값 |
| 입고 | `receiving` | 물건을 실제로 받은 전표 |
| 입고번호 | `receiving_no` | `RC-YYYY-0001`. 연도별 리셋 |
| 입고 라인 | `receiving_line` | |
| 입고일 | `received_date` | `DATE` |
| 확정 | `CONFIRMED` | 코드값. 이때 원장에 기록 |
| 확정 시각 | `confirmed_at` | |
| 확정자 | `confirmed_by` | `account.id` |
| 재고원장 | `stock_ledger` | **append only.** 수량이 움직인 기록 |
| 이동 구분 | `source_type` | `RECEIVING` `SHIPPING` `ADJUST` |
| 출고 | `SHIPPING` | 코드값 |
| 조정 | `ADJUST` | 코드값. 8번 재고에서 씀 |
| 취소 원본 | `reversal_of_id` | 반대 부호 행이 되돌린 원본 원장 id |
| 이동 시각 | `moved_at` | |
| 현재고 | `stock` | 원장의 합계. **캐시** |

## 5. 판매채널

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 판매처 | `sales_channel` | 한 줄 = 창구 하나 |
| 판매처 코드 | `channel_code` | 불변 키. 수기 입력 |
| 플랫폼 구분 | `platform_type` | `SMARTSTORE` `COUPANG` … `OTHER` |
| 엑셀 열 매핑 | `channel_column_map` | 판매처별 「우리 항목 → 엑셀 헤더」 |
| 항목 키 | `field_key` | **코드에 고정.** 주문 컬럼과 1:1 |
| 엑셀 열 이름 | `column_name` | **DB에 저장.** 채널이 바꾸는 쪽 |
| 채널 상품 매핑 | `channel_product_map` | 채널 문자열 → 우리 SKU |
| 채널 상품코드 | `channel_product_code` | 채널이 준 상품번호 |
| 채널 옵션 문자열 | `channel_option_text` | 정규화해서 저장 (공백·전각) |
| 배수 | `quantity_per_unit` | 채널 1개 = 우리 N개. 기본 1 |
| 연결 시각 | `mapped_at` | |
| 연결자 | `mapped_by` | `account.id` |
| 상품 미확인 | — | 주문 라인의 `variant_id` 가 NULL 인 상태 |
| 취소 문자열 | `channel_cancel_status` | 이 판매처에서 「취소」로 볼 채널 상태 값 |

## 6. 주문

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 주문 | `sales_order` | 채널에서 들어온 주문 한 건 |
| 채널 주문번호 | `channel_order_no` | `(channel_id, channel_order_no)` 가 고유 |
| 주문 일시 | `ordered_at` | |
| 채널 상태 | `channel_status` | 채널 원문. **가공하지 않음** |
| 운영 상태 | `status` | `RECEIVED` `CONFIRMED` `READY` `SHIPPED` `HOLD` |
| 접수 | `RECEIVED` | 코드값 |
| 확인 | `CONFIRMED` | 코드값 |
| 출고대기 | `READY` | 코드값. 상품 미확인이 없고 취소가 아닐 때만 |
| 출고완료 | `SHIPPED` | 코드값. **7번 출고 확정으로만 도달** |
| 보류 | `HOLD` | 코드값 |
| 담당자 | `assignee_id` | `account.id` |
| 취소 시각 | `canceled_at` | 상태가 아니라 별도 축 |
| 확인 필요 | `needs_review` | 직전 배치엔 있었는데 이번에 없던 주문 |
| 버전 | `version` | 낙관적 잠금 |
| 채널 원본 | `raw_data` | 수령인 열을 뺀 원본 행 |
| 주문 라인 | `sales_order_line` | |
| 매칭 키 | `match_key` | 재import 때 줄을 찾는 키 |
| 채널 주문상세번호 | `channel_order_line_no` | 있으면 매칭 키가 됨 |
| 차감 수량 | `variant_quantity` | `quantity × quantity_per_unit` |
| 수령인 | `receiver_name` | **개인정보.** 출고완료 후 5년 |
| 수령인 연락처 | `receiver_phone` | **개인정보** |
| 주소 | `receiver_address` | **개인정보** |
| 배송 메시지 | `delivery_message` | **개인정보** |
| 수령인 파기 시각 | `receiver_purged_at` | 있으면 재import가 되살리지 않음 |
| 수령인 보관 기간 | `orderReceiverRetentionYears` | 설정값. 기본 5 |
| 주문 이력 | `sales_order_history` | **append only.** 화이트리스트 항목만 |
| 변경 출처 | `source` | `IMPORT` `MANUAL` `SYSTEM` |
| 수집 배치 | `import_batch` | 엑셀 업로드 한 번 |

## 7. 출고 · 송장

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 출고 | `shipment` | 1건 = 박스 하나 = 송장 하나 |
| 출고번호 | `shipment_no` | `SH-YYYY-0001`. 연도별 리셋 |
| 출고-주문 | `shipment_sales_order` | 한 출고에 담긴 주문들 |
| 출고일 | `shipped_date` | `DATE` |
| 택배사 | `courier` | |
| 택배사 코드 | `courier_code` | 불변 키 |
| 송장번호 | `tracking_no` | 취소해도 지우지 않음 |
| 송장 부착 시각 | `tracking_at` | |
| 채널 통보 여부 | `channel_notified` | false 면 고객 화면에 배송중이 안 뜸 |
| 양식 방향 | `direction` | `IMPORT` 가져오기 / `EXPORT` 내보내기 |
| 택배사 양식 | `courier_column_map` | 방향별 「우리 항목 → 엑셀 열」 |
| 내보내기 기록 | `shipment_export` | 누가·언제·몇 건. **내용은 안 남김** |
| 품목 요약 | `ITEM_SUMMARY` | 택배사 양식 항목 |
| 재고 확인 필요 | — | 현재고가 음수가 된 (조합, 창고, 로트) |

## 8. 재고

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 실사 | `stocktaking` | 실물을 세어 시스템과 대조 |
| 실사번호 | `stocktaking_no` | `ST-YYYY-0001` |
| 기준 시각 | `base_at` | 이 시각의 시스템 값과 비교 |
| 실사 범위 | `scope` | `FULL` 전체 / `PARTIAL` 일부 |
| 실사 라인 | `stocktaking_line` | |
| 시스템 값 | `system_quantity` | 기준 시각 값. 전표 생성 시 복사 |
| 센 값 | `counted_quantity` | **NULL = 안 셈, 0 = 없음** |
| 차이 | `difference_quantity` | 센 값 − 시스템 값 |
| 재고 조정 | `stock_adjustment` | 실사 없이 단건으로 바로잡음 |
| 조정번호 | `adjustment_no` | `AJ-YYYY-0001` |
| 조정 사유 | `reason_code` | `DAMAGE` `LOSS` `FOUND` `RETURN` `OTHER` |
| 파손 | `DAMAGE` | 코드값 |
| 분실 | `LOSS` | 코드값 |
| 발견 | `FOUND` | 코드값 |
| 반품입고 | `RETURN` | 코드값 |
| 기타 | `OTHER` | 코드값. 메모 필수 |
| 안전재고 | `safety_stock` | `product_variant` 컬럼. NULL 이면 관리 안 함 |
| 발주 필요 | — | 판매 가능 재고 < 안전재고 |

## 9. 기부 · 폐기

| 업무용어 | 코드 식별자 | 비고 |
|---|---|---|
| 기부·폐기 | `disposal` | 둘을 함께 담는 전표. 화면에는 「처분」이 안 나옴 |
| 처분번호 | `disposal_no` | `DP-YYYY-0001` |
| 처분 구분 | `disposal_type` | `DONATION` 기부 / `DISCARD` 폐기 |
| 기부 | `DONATION` | 코드값. 기부처 필수 |
| 폐기 | `DISCARD` | 코드값. 기부처 없음 |
| 기부처 | `partner_type = DONATION` | 3번 거래처에 들어감 |
| 처분 사유 | `reason_code` | `NEAR_EXPIRY` `EXPIRED` `DAMAGE` `OTHER` |
| 기한임박 | `NEAR_EXPIRY` | 코드값 |
| 기한만료 | `EXPIRED` | 코드값 |
| 영수증 수령 | `receipt_issued` | 기부금영수증. 나중에 오므로 별도 관리 |
| 영수증 번호 | `receipt_no` | 취소해도 지우지 않음 |
| 단위 장부가 | `unit_book_value` | 로트 매입가에서 자동. **그 시점 값을 고정** |
| 장부가 합계 | `total_book_value` | 라인 합계 캐시 |
