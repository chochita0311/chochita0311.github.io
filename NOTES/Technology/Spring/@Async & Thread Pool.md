---
id: 21
title: "@Async & Thread Pool"
summary: Spring `@Async`와 thread pool을 사용할 때 executor 설정, 병렬성 한계, queue 포화 시 처리 전략까지 같이 봐야 하는 이유를 정리한 노트.
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - concurrency
  - async
  - thread-pool
  - spring
---
# @Async & Thread Pool

`@Async`는 메서드를 비동기로 실행하게 해 주지만, 진짜 핵심은 어노테이션보다 **어떤 executor와 queue 정책으로 돌릴지**다.  
비동기 처리는 속도를 공짜로 올려 주는 기능이 아니라, 스레드와 커넥션 같은 자원을 다른 형태로 소비하는 선택이다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| `@Async` | 메서드를 별도 스레드에서 실행 |
| executor | 실제 실행을 담당하는 thread pool |
| 주의점 | self invocation, pool 크기, queue 포화, rejection 처리 |
| 헷갈리기 쉬운 것 | parallel stream, `Future`, `@Async`는 비슷해 보여도 운영 포인트가 다름 |

## 1. `@Async`는 무엇을 바꾸나

Spring 공식 문서 기준으로 `@Async`를 쓰려면 `@EnableAsync`를 활성화하고, 필요하면 전용 executor를 등록해야 한다.  
핵심은 호출 스레드에서 바로 실행하던 일을 **task executor로 넘기는 것**이다.

즉, `@Async` 자체가 성능 최적화가 아니라:

- 요청 스레드를 빨리 반환하거나
- 독립적으로 처리해도 되는 일을 분리하거나
- 외부 I/O 대기 시간을 다른 스레드로 넘기는

용도에 더 가깝다.

## 2. thread pool을 같이 봐야 하는 이유

비동기 메서드를 많이 붙여도 executor 설정이 빈약하면 금방 병목이 생긴다.

| 설정 포인트 | 왜 중요한가 |
| --- | --- |
| core/max pool size | 동시에 얼마나 많은 작업을 처리할지 |
| queue capacity | 순간 유입을 얼마나 버퍼링할지 |
| rejection policy | 넘친 작업을 어떻게 처리할지 |

카카오커머스/Hikari 관련 자료들처럼, 결국 병렬성은 DB 커넥션·외부 API·CPU 한계와 같이 봐야 한다.  
스레드를 무작정 늘리면 오히려 컨텍스트 스위칭과 downstream 병목만 커질 수 있다.

## 3. parallel stream, Future와의 차이

이 노트의 관련 링크는 `parallelStream`, `Future`도 같이 가리킨다.  
이 셋은 모두 “비동기/병렬”처럼 보이지만 성격이 다르다.

| 도구 | 성격 |
| --- | --- |
| `parallelStream()` | 데이터 처리 병렬화, 기본 fork-join pool 영향 큼 |
| `Future` | 비동기 결과를 추적하는 저수준 계약 |
| `@Async` | Spring bean 메서드를 executor 기반으로 분리 실행 |

실무적으로는 웹/비즈니스 서비스 코드에서 `@Async + 명시적 executor`가 제어가 더 쉽다.

## 4. rejection과 back pressure

queue가 차고 pool도 꽉 찼는데 작업이 더 들어오면 rejection이 발생한다.  
Baeldung의 `RejectedExecutionHandler` 정리처럼 이건 예외가 아니라 **설계 시점에 반드시 결정해야 하는 정책**이다.

대표 정책:

- 호출자 스레드에서 직접 실행
- 예외 던지기
- 오래된 작업 버리기
- 새 작업 버리기

어떤 정책이 맞는지는 작업 성격에 따라 다르다.

## 5. 실무 체크리스트

- `@Async`는 반드시 전용 executor와 같이 본다.
- queue를 무한정 크게 두면 지연이 숨어 버릴 수 있다.
- executor 크기는 DB 커넥션 수나 외부 API 병목과 같이 튜닝한다.
- self invocation이면 `@Async`가 안 먹을 수 있다.
- 실패/재시도/timeout 전략까지 같이 정리한다.

## 6. 정리

`@Async`의 본질은 비동기 문법이 아니라 **작업을 어떤 executor 정책으로 분리할 것인가**다.  
속도보다 먼저 자원 한계와 포화 시 행동을 결정해야 운영이 안정적이다.

## References

- https://www.baeldung.com/java-when-to-use-parallel-stream
- https://www.baeldung.com/java-8-parallel-streams-custom-threadpool
- https://www.baeldung.com/java-future
- https://kakaocommerce.tistory.com/45
- https://www.baeldung.com/spring-async
- https://docs.spring.io/spring-framework/reference/integration/scheduling.html
- https://xxeol.tistory.com/44
- https://steady-coding.tistory.com/611
- https://velog.io/@gillog/Spring-Async-Annotation%EB%B9%84%EB%8F%99%EA%B8%B0-%EB%A9%94%EC%86%8C%EB%93%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
- https://sabarada.tistory.com/215
- https://www.baeldung.com/java-rejectedexecutionhandler
- https://docs.spring.io/spring-framework/reference/integration/scheduling.html#scheduling-task-executor-types
