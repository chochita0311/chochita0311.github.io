---
id: 77
title: "Qualifier"
summary: "같은 타입 bean이 여러 개 있을 때 @Qualifier로 주입 대상을 어떻게 명시하는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - bean
  - di
created: 2026-04-20
updated: 2026-04-20
---
# Qualifier

Spring에서 같은 타입의 bean이 여러 개 있으면 주입 시점에 모호성이 생긴다. `@Qualifier`는 이때 어떤 bean을 원하는지 이름이나 식별자로 더 좁혀 주는 도구다.

## 한눈에 보기
- 문제 상황: 같은 타입 bean이 둘 이상 존재
- 역할: 타입 기반 후보를 더 좁혀 줌
- 자주 쓰는 곳: 전략 패턴, 다중 클라이언트, 구현체 분기
- 함께 보는 것: `@Primary`, bean naming 규칙

## 언제 필요한가

- 같은 인터페이스 구현체가 여러 개일 때
- 전략 패턴처럼 구현체 선택이 필요한 구조일 때

## 기본 개념

```java
@Autowired
public PaymentService(@Qualifier("kakaoPayClient") PayClient payClient) {
    this.payClient = payClient;
}
```

핵심은 타입만으로 결정되지 않을 때, `@Qualifier`가 bean 선택 기준을 더 좁혀 준다는 점이다.

## `@Primary`와 어떻게 다른가
`@Primary`는 여러 후보 중 기본 선택지를 정하는 방식이다. 반면 `@Qualifier`는 특정 주입 지점에서 "나는 이 bean이 필요하다"를 명시하는 방식이다. 구현체 수가 적을 때는 `@Primary` 하나로도 충분할 수 있지만, 선택 지점이 많아질수록 `@Qualifier`가 의도를 더 분명히 보여 준다.

## 예제로 보는 차이
기본 결제 수단 하나만 정하면 `@Primary`로 충분할 수 있다. 하지만 결제 방식별로 주입 지점이 다르면 `@Qualifier`가 더 명확하다.

```java
public PaymentService(@Qualifier("kakaoPayClient") PayClient payClient) {
    this.payClient = payClient;
}
```

이 코드는 "후보가 여러 개지만 여기서는 이 구현이 필요하다"를 생성자 시그니처에서 바로 보여 준다.

## 실무 포인트

- 구현체 수가 늘어날수록 명시적 주입이 더 안전하다
- bean 이름 규칙을 팀에서 일관되게 가져가는 편이 좋다
- 선택 로직이 너무 많아지면 팩토리/전략 등록 구조를 고민할 수 있다

## 정리

`@Qualifier`는 DI가 복잡해졌을 때 붙이는 임시 꼼수가 아니라, 다중 구현체 상황에서 의도를 명시하는 장치다. 구현체가 늘수록 타입만으로 해결하려 하지 말고, 선택 기준을 코드에 직접 남기는 편이 낫다.

## References

- https://mungto.tistory.com/458
