---
id: 34
title: "Spring Boot ApplicationRunner"
summary: Spring Boot startup 직후 한 번 실행되는 작업을 `ApplicationRunner`로 구성할 때의 기준을 정리한 노트.
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - spring-boot
  - application-runner
  - startup
---
# Spring Boot ApplicationRunner

`ApplicationRunner`는 Spring Boot 애플리케이션이 시작된 직후, 트래픽을 받기 전에 한 번 실행할 작업을 넣을 때 쓰는 훅이다.

## 한눈에 보기

- startup 후 1회 실행 작업에 적합
- `ApplicationArguments`를 받을 수 있음
- 여러 runner가 있으면 `@Order`나 `Ordered`로 순서 제어 가능

## CommandLineRunner와 차이

Spring Boot 공식 문서 기준으로 `ApplicationRunner`와 `CommandLineRunner`는 같은 성격의 startup hook이다.

| 인터페이스 | 차이 |
| --- | --- |
| `CommandLineRunner` | 문자열 배열 인자 사용 |
| `ApplicationRunner` | `ApplicationArguments` 사용 |

즉, 인자 파싱이 조금 더 풍부하게 필요하면 `ApplicationRunner`가 자연스럽다.

핵심은 둘 다 "애플리케이션 부팅 직후 명시적 작업 단계를 만든다"는 점이다.

## 언제 쓰나

- 초기 데이터 적재
- 캐시 warm-up
- 외부 시스템 상태 점검
- feature flag나 설정에 따라 선택적으로 수행되는 bootstrap 작업

## 조건부 실행

runner를 항상 띄우고 싶지 않다면 `@ConditionalOnProperty`와 같이 묶는 패턴이 실무에서 유용하다.

Baeldung 정리 기준으로 `@ConditionalOnProperty`는 property가 존재하거나 특정 값을 가질 때만 bean 등록을 허용한다.

```java
@Bean
@ConditionalOnProperty(prefix = "app.startup", name = "enabled", havingValue = "true")
ApplicationRunner startupRunner() {
    return args -> { };
}
```

이런 방식은 로컬/운영/배치 환경별로 startup 작업을 다르게 켜고 싶을 때 특히 유용하다.

## 주의할 점

- startup time을 직접 늘릴 수 있다
- 실패 시 애플리케이션 전체 기동 실패로 이어질 수 있다
- “초기화 작업”과 “정기 작업”을 혼동하지 않아야 한다
- 외부 시스템 호출이 길어지면 readiness와 기동 안정성에 영향을 준다

## `@PostConstruct`와 무엇이 다른가
`@PostConstruct`는 bean 초기화 훅에 가깝고, `ApplicationRunner`는 애플리케이션 부팅 이후의 명시적 startup 단계에 가깝다. 여러 초기화 작업을 순서 있게 관리하거나, 조건부로 켜고 끄고 싶을 때는 runner 쪽이 더 표현력이 좋다.

## 정리

`ApplicationRunner`는 `@PostConstruct` 대체가 아니라, **애플리케이션 시작 직후의 명시적 bootstrap 단계**를 만드는 도구다.  
필요하면 `@ConditionalOnProperty`와 함께 써서 환경별로 켜고 끄는 편이 좋다. 간단하지만 잘못 쓰면 startup time과 운영 안정성에 바로 영향을 준다.

## References

- https://docs.spring.io/spring-boot/reference/features/spring-application.html#features.spring-application.command-line-runner
- https://www.baeldung.com/spring-conditionalonproperty
