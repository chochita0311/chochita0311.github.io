---
id: 87
title: "TransactionSynchronizationManager"
summary: "Spring 트랜잭션 동기화의 핵심 객체인 `TransactionSynchronizationManager`가 무엇을 보관하고 언제 써야 하는지 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# TransactionSynchronizationManager

## 한눈에 보기
`TransactionSynchronizationManager`는 Spring이 현재 스레드에 바인딩된 트랜잭션 자원과 동기화 콜백을 관리하는 중심 객체다. 쉽게 말해 "지금 이 스레드가 트랜잭션 안에 있는지", "어떤 커넥션/세션이 묶여 있는지", "커밋 직전/직후에 무엇을 실행할지"를 담아두는 곳이다.

## 왜 존재하는가
Spring의 트랜잭션 추상화는 `PlatformTransactionManager`를 중심으로 동작하지만, 실제 실행 중인 스레드 어딘가에는 현재 상태를 보관할 저장소가 필요하다. 그 역할을 `TransactionSynchronizationManager`가 맡는다.

이 덕분에 하위 계층은 매번 트랜잭션 객체를 파라미터로 전달받지 않아도, 현재 스레드에 바인딩된 자원과 동기화 상태를 참조할 수 있다.

## 무엇을 보관하는가
대표적으로 다음 정보를 다룬다.

- 현재 트랜잭션 활성 여부
- 현재 트랜잭션 이름
- read-only 여부
- isolation level
- 스레드에 바인딩된 resource
- 등록된 synchronization callback

즉 이 객체는 단순 플래그 저장소가 아니라, 트랜잭션 문맥 전체를 스레드 로컬 기반으로 연결하는 허브다.

## 어디서 체감되는가
이 개념은 보통 다음 상황에서 눈에 띈다.

- `TransactionSynchronizationManager.isActualTransactionActive()`로 현재 트랜잭션 확인
- `@TransactionalEventListener`나 커밋 후 후처리
- 하나의 트랜잭션 안에서 JDBC Connection / JPA EntityManager 재사용
- 프레임워크 내부에서 resource binding / unbinding

즉 애플리케이션 코드에서는 자주 직접 만지지 않지만, 트랜잭션 관련 이상 동작을 이해할 때는 거의 반드시 만나게 된다.

## 왜 thread-bound라는 표현이 중요한가
이 객체는 스레드 로컬 기반으로 동작한다. 그래서 같은 요청 흐름처럼 보여도 스레드가 바뀌는 순간 문맥이 끊길 수 있다. `@Async`나 별도 executor로 넘어간 코드에서 부모 트랜잭션을 기대하면 안 되는 이유가 여기서 나온다.

## `PlatformTransactionManager`와의 관계
`PlatformTransactionManager`가 트랜잭션 시작, 커밋, 롤백을 지휘하는 상위 계약이라면, `TransactionSynchronizationManager`는 그 실행 중간 상태를 스레드에 유지하는 하부 인프라에 가깝다. 둘은 대체 관계가 아니라 계층 관계다.

## 주의점
이 객체가 스레드 기반이라는 점이 중요하다. 따라서 비동기 실행, 스레드 전환, 메시지 소비, 리액티브 흐름처럼 실행 문맥이 바뀌는 순간에는 같은 방식으로 문맥이 이어지지 않는다. 그래서 `@Async` 안에서 부모 트랜잭션을 기대하면 안 되는 이유와도 연결된다.

또한 애플리케이션 코드에서 이 객체를 직접 조작하는 것은 보통 최후 수단이다. 상태 확인이나 synchronization 등록 정도는 가능하지만, 트랜잭션 제어 자체는 상위 추상화에 맡기는 편이 맞다.

## 실무에서 어떻게 쓰는가
대부분은 직접 값을 넣고 빼는 용도보다, 현재 트랜잭션 활성 여부를 확인하거나, 커밋 이후 후처리 타이밍을 이해하는 용도로 만난다. 즉 직접 제어 도구라기보다 내부 동작을 읽는 렌즈에 가깝다.

## 정리
`TransactionSynchronizationManager`는 Spring 트랜잭션이 "현재 스레드 문맥" 위에서 동작한다는 사실을 가장 잘 드러내는 클래스다. 트랜잭션 활성 여부, 자원 바인딩, 커밋 전후 콜백을 이해하려면 이 객체를 중심으로 보면 된다. 다만 직접 제어 도구라기보다 내부 동작을 읽기 위한 창에 가깝다.

## References
- [Baeldung: Detecting If a Spring Transaction Is Active](https://www.baeldung.com/spring-transaction-active)
- [Spring Javadoc: TransactionSynchronizationManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/support/TransactionSynchronizationManager.html)
- [Spring Javadoc: PlatformTransactionManager](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/PlatformTransactionManager.html)
- [JTA를 이용한 분산 트랜잭션](https://wannaqueen.gitbook.io/spring5/spring-boot/undefined-1/39.-jta-by-ys)
- [[Spring] Transaction 추상화, 동기화](https://steadyjay.tistory.com/37)
