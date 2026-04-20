---
id: 50
title: "OrElse vs OrElseGet"
summary: "`Optional.orElse()`와 `orElseGet()`의 eager/lazy 평가 차이와 부작용 위험을 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# `orElse` vs `orElseGet`

`Optional.orElse()`와 `orElseGet()`은 결과만 보면 비슷해 보이지만, 평가 시점이 다르다. 이 차이를 모르고 쓰면 성능 문제나 의도치 않은 부작용이 생길 수 있다.

## 차이의 핵심
- `orElse(value)`: 값이 있어도 `value`를 미리 평가한다
- `orElseGet(supplier)`: 값이 비어 있을 때만 supplier를 실행한다

## 예제로 보면 바로 드러난다

```java
String name = Optional.of("kim")
    .orElse(expensiveFallback());
```

위 코드는 Optional 안에 값이 있어도 `expensiveFallback()`을 먼저 실행한다.

```java
String name = Optional.of("kim")
    .orElseGet(() -> expensiveFallback());
```

이 경우에는 Optional이 비어 있을 때만 fallback이 실행된다.

## 흔한 오해
둘의 차이를 "성능 최적화 팁" 정도로만 보는 경우가 많다. 하지만 실제로는 부작용 제어 문제이기도 하다. fallback 메서드가 로그를 남기거나 외부 호출을 하면, `orElse()`는 값이 있어도 그 작업을 수행해 버린다.

## 언제 체감되나
기본값이 단순 상수면 둘 차이가 거의 없다. 하지만 DB 조회, 객체 생성, 외부 메서드 호출이 들어가면 eager/lazy 차이가 분명해진다.

즉 비용뿐 아니라 부작용도 문제다. fallback 메서드가 로그를 남기거나 상태를 바꾸는 코드라면, `orElse()`는 Optional에 값이 있어도 그 로직을 실행해 버릴 수 있다.

## 실무 기준
- 상수/가벼운 기본값: `orElse()`
- 메서드 호출, 객체 생성, 외부 의존성 접근: `orElseGet()`
- fallback에 부작용이 있으면 거의 항상 `orElseGet()` 우선

## 기억하기 쉬운 기준
fallback을 변수처럼 이미 들고 있으면 `orElse()`도 자연스럽다. 반면 계산해야 하는 값이면 거의 항상 `orElseGet()`이 더 안전하다. 즉 값이냐, 계산이냐로 나누면 실수가 줄어든다.

## 정리
기본값이 계산 비용 없는 상수면 `orElse()`도 괜찮다. 하지만 비용이 있거나 부작용 가능성이 있으면 `orElseGet()`을 기본으로 보는 편이 실수를 줄인다.

## References
- [Baeldung: `orElse()` vs `orElseGet()`](https://www.baeldung.com/java-optional-or-else-vs-or-else-get)
