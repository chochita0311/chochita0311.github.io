---
id: 65
title: "Spring Event Publishing"
summary: "Spring event publishing과 `@TransactionalEventListener`가 트랜잭션 경계와 함께 어떻게 동작하는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - event
  - transaction
created: 2026-04-20
updated: 2026-04-20
---
# Spring Event Publishing

Spring event는 같은 프로세스 안에서 도메인 이벤트나 후속 작업을 느슨하게 분리할 때 쓰기 좋다.  
특히 트랜잭션과 같이 쓰면 “언제 listener를 실행할지”가 핵심 포인트가 된다.

## 한눈에 보기

- `ApplicationEventPublisher`로 이벤트 발행
- 일반 listener는 발행 시점에 동기/비동기로 반응
- `@TransactionalEventListener`는 트랜잭션 phase와 함께 동작

## 기본 개념

## 왜 트랜잭션 phase가 중요하나

공식 문서와 Javadoc 기준으로 `@TransactionalEventListener`는 transaction-bound event를 다룬다.  
즉, 이벤트를 발행했다고 곧바로 listener를 실행하는 게 아니라:

- `BEFORE_COMMIT`
- `AFTER_COMMIT`
- `AFTER_ROLLBACK`
- `AFTER_COMPLETION`

같은 phase를 기준으로 동작시킬 수 있다.

즉 이벤트를 발행했다는 사실과 listener가 실제 실행되는 시점은 다를 수 있다. 이 차이를 모르면 "이벤트를 발행했는데 왜 아직 안 돌지?" 같은 혼란이 생긴다.

## 자주 생기는 오해

- DB 반영 전에 실행돼야 하는지
- 커밋 이후에만 실행돼야 하는지
- rollback 되면 listener를 건너뛰어야 하는지

이걸 명시하지 않으면 update 안 됨, 이벤트 안 탐 같은 혼란이 생기기 쉽다.

## TransactionSynchronization와 연결

하위 개념으로는 `TransactionSynchronization`의 afterCompletion 같은 lifecycle hook과 맞닿아 있다.  
즉, 이벤트 리스너도 결국 트랜잭션 생명주기와 결합해 이해하는 편이 맞다.

## 언제 유용한가
- 커밋 이후 알림 발송
- 외부 메시지 브로커 publish
- 메일/푸시/후속 비동기 작업 트리거
- rollback 시 보상 로깅이나 후처리

이런 작업은 보통 "도메인 상태가 실제로 커밋된 뒤" 실행돼야 의미가 맞는다.

## 실무 포인트

- 도메인 상태가 commit된 뒤만 안전한 작업이면 `AFTER_COMMIT`
- rollback에도 후처리가 필요하면 phase를 명시
- 외부 메시지 발행, 알림, 후속 비동기 작업은 commit 이후가 더 안전한 경우가 많다
- 단순 이벤트 발행과 트랜잭션 바인딩 이벤트를 구분해서 본다

## 정리

Spring event 자체는 단순하지만, `@TransactionalEventListener`가 붙는 순간 **이벤트 시점 = 트랜잭션 시점** 문제가 된다.  
listener가 언제 실행되어야 올바른지부터 먼저 정해야 한다.

## References

- https://ssow93.tistory.com/75
- https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html
- https://dkswnkk.tistory.com/754
- https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/event/TransactionalEventListener.html
- https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/support/TransactionSynchronization.html#afterCompletion(int)
- https://jun-codinghistory.tistory.com/658
