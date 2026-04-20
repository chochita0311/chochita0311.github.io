---
id: 61
title: "BootstrapMode for JPA"
summary: "Spring Data JPA repository bootstrap mode가 startup 시간과 초기화 시점에 어떤 영향을 주는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - spring-data-jpa
  - startup
  - bootstrap
created: 2026-04-20
updated: 2026-04-20
---
# BootstrapMode for JPA

Spring Data JPA는 애플리케이션 시작 시점에 repository bean을 어떻게 초기화할지 조절할 수 있다.  
repository 수가 많거나 JPA 메타모델 검증 비용이 큰 애플리케이션에서는 이 설정이 startup 체감에 영향을 준다.

## 한눈에 보기

| 모드 | 의미 |
| --- | --- |
| `DEFAULT` | repository를 eager하게 초기화 |
| `LAZY` | 실제 첫 사용 시점에 초기화 |
| `DEFERRED` | 애플리케이션 시작 과정에서는 미루고, 이후 지연 초기화 |

## 1. 왜 보게 되나

Spring Data는 startup 때 repository를 스캔하고 bean definition을 등록한다.  
이 과정에서 JPA metamodel 접근, query validation, `EntityManager` 관련 초기화가 같이 발생할 수 있다.

repository가 많아질수록 이런 초기화가 startup 시간을 밀 수 있다.  
그래서 `bootstrap-mode`는 단순 설정이 아니라 **startup 속도와 초기 검증 시점의 trade-off**를 조절하는 옵션으로 봐야 한다.

## 2. 설정 방법

프로퍼티로 줄 수 있다.

```properties
spring.data.jpa.repositories.bootstrap-mode=default
```

또는 설정 어노테이션에서도 지정할 수 있다.

```java
@EnableJpaRepositories(bootstrapMode = BootstrapMode.DEFAULT)
```

테스트에서는 `@DataJpaTest`에 붙여서 개별적으로 확인할 수도 있다.

```java
@DataJpaTest(bootstrapMode = BootstrapMode.LAZY)
class RepositoryTest {
}
```

## 3. 각 모드의 차이

### 3-1. `DEFAULT`

`DEFAULT`는 repository를 eager하게 초기화한다.  
즉, 일반 Spring bean처럼 애플리케이션 시작 과정에서 준비해 두는 쪽이다.

장점:

- startup 직후 repository가 바로 준비됨
- 초기화 문제를 빨리 발견하기 쉬움

주의점:

- repository 수가 많으면 startup이 느려질 수 있음

### 3-2. `LAZY`

`LAZY`는 bean definition은 등록하지만, 실제 repository 인스턴스 생성은 첫 사용 시점까지 미룬다.

이 모드는 다음 상황에서 유용하다.

- startup 시간을 줄이고 싶을 때
- 모든 repository가 항상 바로 필요하지 않을 때
- 테스트에서 지연 초기화 동작을 분리해서 보고 싶을 때

대신 첫 호출 시점에 초기화 비용이 한 번 몰릴 수 있다.

### 3-3. `DEFERRED`

`DEFERRED`는 startup 중 즉시 eager 초기화를 하지 않고, 애플리케이션이 올라오는 흐름과 분리해 지연 초기화를 트리거한다.

이 모드는 `DEFAULT`와 `LAZY`의 중간처럼 이해하면 편하다.

| 관점 | 해석 |
| --- | --- |
| startup 체감 | `DEFAULT`보다 가벼울 수 있음 |
| 첫 호출 부담 | `LAZY`처럼 완전히 첫 사용 시점까지 미루는 것과는 다름 |
| 목적 | 초기 부팅 경로를 가볍게 하되 repository 준비를 너무 늦추지 않음 |

## 4. 언제 어떤 모드를 볼까

| 상황 | 더 자연스러운 선택 |
| --- | --- |
| 일반 서비스, repository 수 적음 | `DEFAULT` |
| startup 최적화가 중요함 | `LAZY` 또는 `DEFERRED` 검토 |
| 테스트에서 특정 repository만 늦게 쓰임 | `LAZY` |
| 부팅 경로와 초기화 비용을 분리하고 싶음 | `DEFERRED` |

## 5. 실무 포인트

- startup이 느리다고 바로 bootstrap mode부터 바꾸기보다, 실제 병목이 repository 초기화인지 먼저 본다.
- 지연 초기화는 startup 시간을 줄일 수 있지만, 문제 발견 시점을 늦출 수도 있다.
- 선언형 query validation 시점이 바뀌면 장애 발견 타이밍도 달라질 수 있다.
- 테스트 환경과 운영 환경의 bootstrap mode 차이도 의식해야 한다.

## 6. 정리

`BootstrapMode`는 JPA repository를 **언제 준비할지**를 조절하는 설정이다.

핵심은 단순히 빠른 startup이 아니라:

1. 초기화 비용을 언제 지불할지
2. repository 관련 문제를 언제 발견할지
3. startup 경로를 얼마나 가볍게 만들고 싶은지

를 선택하는 것이다.

repository가 많고 startup이 민감한 서비스라면 `DEFAULT`만 당연하게 두지 말고, `LAZY`와 `DEFERRED`를 같이 비교해서 볼 가치가 있다.

## References

- https://www.baeldung.com/jpa-bootstrap-mode
