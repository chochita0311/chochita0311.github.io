---
id: 64
title: "Customizing the Nature of a Bean"
summary: "빈 생성 순서, 초기화와 종료 콜백, SmartLifecycle, 의존 순서를 조합해 빈의 생애주기를 제어하는 방법을 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Customizing the Nature of a Bean

## 한눈에 보기
Spring에서 빈의 "성격"을 바꾼다는 말은 단순히 스코프를 바꾸는 것보다 넓다. 생성 시점, 의존 순서, 초기화와 종료 콜백, `SmartLifecycle` 참여 여부, 셧다운 단계까지 모두 포함해서 빈의 생애주기를 조정하는 작업이다.

실무에서는 외부 리소스를 붙잡고 있는 빈에서 이 문제가 자주 드러난다. Redis 커넥션 팩토리, 메시지 리스너, 스케줄러, 워커 풀처럼 시작과 종료 순서가 중요한 컴포넌트는 기본 생성/소멸 규칙만으로는 부족할 수 있다.

## 기본 생애주기 제어
Spring은 빈 생성 뒤 초기화 콜백을 호출하고, 컨테이너 종료 시 소멸 콜백을 호출할 수 있다. 기본적으로는 다음 축으로 조절한다.

- 초기화: `@PostConstruct`, `InitializingBean`, `initMethod`
- 종료: `@PreDestroy`, `DisposableBean`, `destroyMethod`
- 의존 순서: `@DependsOn`

핵심은 "주입 순서"와 "실행 가능 상태"를 구분하는 것이다. 어떤 빈이 다른 빈을 참조할 수 있다고 해서, 그 대상이 실제 네트워크 연결이나 내부 워커 준비까지 마친 것은 아니다.

## `@DependsOn`이 해결하는 것과 못 하는 것
`@DependsOn`은 특정 빈이 먼저 초기화되도록 보장할 때 유용하다. 반대로 종료 시점에는 의존하는 빈이 먼저 내려가고, 의존 대상이 나중에 종료되도록 순서를 잡는 데도 도움이 된다.

다만 `@DependsOn`은 어디까지나 빈 의존 그래프 기준이다. 비동기 초기화, 별도 라이프사이클 인터페이스, 네트워크 연결 준비 상태까지 완전히 보장하지는 않는다. 그래서 외부 자원과 얽힌 컴포넌트에서는 `SmartLifecycle`의 phase와 auto-start 동작을 함께 봐야 한다.

## `SmartLifecycle`과 시작/종료 순서
`SmartLifecycle`은 애플리케이션 컨텍스트 리프레시 이후 자동 시작 여부와 시작/정지 순서를 제어한다. phase가 작은 컴포넌트가 먼저 시작하고 늦게 종료되며, phase가 큰 컴포넌트는 나중에 시작하고 먼저 종료된다.

이 모델은 graceful shutdown과 잘 연결된다. 웹 서버가 더 이상 새 요청을 받지 않게 한 뒤, 백그라운드 워커나 외부 연결 빈을 단계적으로 내리는 식으로 정리할 수 있다.

## LettuceConnectionFactory 사례
Spring Data Redis의 `LettuceConnectionFactory`는 `SmartLifecycle`을 구현한다. 그래서 단순 데이터소스처럼 "있으면 쓰는 객체"가 아니라, 시작과 정지 시점이 존재하는 빈으로 봐야 한다.

실제로 관련 이슈에서는 애플리케이션 종료 과정에서 `LettuceConnectionFactory`가 예상보다 먼저 stop 되어, 그 빈을 참조하는 후행 컴포넌트가 종료 로직에서 Redis 연결을 더 이상 쓰지 못하는 문제가 보고되었다. 즉 문제의 본질은 Redis 자체가 아니라, 라이프사이클 빈 간 정지 순서였다.

이럴 때는 다음을 같이 봐야 한다.

- `SmartLifecycle` phase
- `@DependsOn`
- 종료 시 호출되는 콜백 내부에서 외부 자원을 다시 건드리는지 여부
- graceful shutdown 단계에서 웹 요청 종료와 내부 워커 종료 순서

## 실무 기준
이 주제를 다룰 때는 "빈이 만들어졌는가"보다 "언제부터 안전하게 쓸 수 있고, 언제까지 살아 있어야 하는가"를 기준으로 보는 편이 맞다.

- 단순 계산용/상태 없는 빈: 기본 규칙으로 충분한 경우가 많다.
- 외부 연결 빈: init/destroy 콜백과 shutdown 순서를 의식해야 한다.
- 메시지 리스너/스케줄러/워커: `SmartLifecycle` phase 검토가 필요하다.
- 종료 중 후처리 로직이 있는 빈: 의존 자원이 먼저 닫히지 않도록 설계해야 한다.

## 정리
`Customizing the Nature of a Bean`은 문법 한두 개를 외우는 주제가 아니라, 컨테이너가 빈을 언제 만들고 언제 실행 가능 상태로 보고 언제 안전하게 내릴지를 제어하는 설계 문제다. 특히 Redis, 메시징, 스케줄링처럼 외부 자원을 물고 있는 빈에서는 라이프사이클과 종료 순서를 명시적으로 다루는 편이 운영 안정성에 직접 연결된다.

## References
- [Spring Framework Reference: Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-lifecycle-default-init-destroy-methods)
- [spring-data-redis issue #2843](https://github.com/spring-projects/spring-data-redis/issues/2843)
- [spring-data-redis issue #2957](https://github.com/spring-projects/spring-data-redis/issues/2957)
- [LettuceConnectionFactory API](https://docs.spring.io/spring-data/redis/docs/current/api/org/springframework/data/redis/connection/lettuce/LettuceConnectionFactory.html)
- [Customizing the Nature of a Bean](https://velog.io/@dev_hammy/Customizing-the-Nature-of-a-Bean)
- [Spring Boot Graceful Shutdown](https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html)
- [Baeldung: @DependsOn](https://www.baeldung.com/spring-depends-on)
