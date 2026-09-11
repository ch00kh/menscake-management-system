---
name: suggestion
description: Use when the user asks for a proposal, recommendation, or opinion instead of giving a direct execution instruction — Korean phrases like "제안해줘", "어떻게 생각해", "~하면 어때", or English "what do you think", "any suggestions". Also directly invocable as /suggestion. Presents 3+ distinct options instead of one recommendation, and holds off on any file writes or commits (including unrelated already-pending work) until the user picks one.
---

# Suggestion

사용자가 "제안해줘"/"어떻게 생각해"처럼 검토용 의견을 요청할 때 쓰는 스킬이다. 목표는 하나의 추천안을 성급하게 실행해버리는 사고를 막는 것.

## 계기

"앞으로 API 문서는 어디에 넣는 게 좋을지 제안해줘"라는 요청을 받고, 검토받기도 전에 곧바로 파일을 쓰고 커밋·푸시·PR까지 만들어버린 사고가 있었다. "제안해줘"는 검토 요청이지 실행 승인이 아니다.

## 규칙

1. **최소 3가지 이상의 서로 다른 선택지를 제시한다.** 하나의 추천안만 던지지 않는다. 각 선택지는 사소한 변형이 아니라 실제로 구분되는 접근이어야 하고, 선택지마다 장단점을 같이 설명한다. 그중 추천하는 게 있으면 이유와 함께 표시해도 되지만, 나머지 선택지도 실행 가능한 수준으로 구체적이어야 한다.
2. **파일 쓰기, 커밋, 푸시, PR 생성, 이슈 생성 등 실행 액션을 하지 않는다.** 제안은 대화창 텍스트로만 제시한다. 사용자가 선택지 중 하나를 명시적으로 고르거나 승인할 때까지 기다린다.
3. **이 요청 이전에 아직 커밋되지 않은 다른 작업도 함께 보류한다.** 제안을 요청받은 시점에 미커밋 변경사항이 남아있다면 — 이번 제안과 무관해 보이는 것이라도 — 사용자가 선택지를 검토하기 전까지는 커밋·푸시하지 않는다.
4. 한 메시지 안에 직접 지시("~해줘")와 제안 요청("~제안해줘")이 섞여 있으면, 직접 지시 부분만 정상 진행하고 제안 요청 부분은 이 스킬대로 선택지 제시 후 대기한다. 제안 요청이 있다는 이유로 전체 메시지를 실행 보류하지는 않는다 — 딱 그 부분만 게이트를 건다.
5. 사용자가 선택지 중 하나를 고르면, 그 선택을 실행 지시로 받아들이고 정상적으로(파일 쓰기/커밋 포함) 진행한다. 이 스킬의 "실행 금지"는 선택 전까지만 적용된다.
