---
id: 29
title: "@UtilityClass"
summary: "Lombok `@UtilityClass`가 실제로 만드는 코드와 정적 유틸리티 남용이 설계를 약하게 만드는 이유를 정리한 노트."
created: 2026-04-05
updated: 2026-04-20
tags:
  - java
  - lombok
  - utility-class
  - oop
---

# `@UtilityClass`

## 한눈에 보기
Lombok `@UtilityClass`는 클래스를 `final`로 만들고 생성자를 막아, 정적 메서드만 가진 유틸리티 클래스를 쉽게 만든다. 문법은 간단해지지만, 그만큼 정적 메서드가 설계 경계를 우회하며 퍼지기 쉬워진다.

## Lombok이 실제로 해 주는 일
`@UtilityClass`는 보통 아래 패턴을 줄여 준다.

```java
public final class SlugUtils {
    private SlugUtils() {
    }

    public static String normalize(String value) {
        return value.trim().toLowerCase();
    }
}
```

이를 Lombok으로 쓰면 다음처럼 표현한다.

```java
@UtilityClass
public class SlugUtils {
    public String normalize(String value) {
        return value.trim().toLowerCase();
    }
}
```

즉 `@UtilityClass`는 설계 패턴을 새로 제공하는 것이 아니라, 이미 정적 유틸리티로 만들겠다는 결정을 축약해 주는 도구다.

## 어디까지 허용할 것인가
유틸리티 클래스는 순수 계산, 포맷팅, 작은 변환처럼 상태가 없고 도메인 의미가 약한 코드에 제한적으로 쓰는 편이 맞다. 반대로 비즈니스 규칙이나 외부 의존성이 들어오면 서비스나 값 객체로 올리는 편이 낫다.

예를 들어 아래 정도는 유틸리티에 가깝다.

```java
@UtilityClass
public class MaskingUtils {
    public String maskPhone(String phone) {
        return phone.replaceAll("(\\d{3})\\d+(\\d{4})", "$1****$2");
    }
}
```

반면 아래는 객체 책임이 더 자연스럽다.

```java
@UtilityClass
public class OrderPolicyUtils {
    public boolean canCancel(Order order, LocalDateTime now) {
        return order.isPaid() && now.isBefore(order.getDeliveryStartedAt());
    }
}
```

이 로직은 `Order`나 도메인 서비스가 들고 있어야 할 규칙에 가깝다.

## 왜 남용되기 쉬운가
정적 메서드는 호출이 쉽고 어디서나 접근할 수 있어서 빠르게 퍼진다. 하지만 그렇게 모인 코드가 많아질수록 객체 협력 구조가 흐려지고, 테스트 대체 지점도 줄어든다.

Baeldung가 구분하듯 utility class는 전역 범용 보조 도구에 가깝고, helper는 특정 모듈 맥락에 묶일 수 있다. 이 차이를 무시하면 "모든 보조 로직을 static class에 모으는" 방향으로 쉽게 기울게 된다.

## 실무 기준
- 문자열/날짜/포맷 변환: 허용 가능
- 비즈니스 규칙: 지양
- 외부 시스템 접근: 빈이나 서비스로 분리
- 테스트에서 대체 지점이 중요: static보다 객체 협력 우선

## 정리
`@UtilityClass`는 패턴 자체를 정당화하는 도구가 아니라, 이미 정적 유틸리티가 맞다고 판단된 경우에만 쓰는 편의 기능이다. 편해 보여도 도메인 규칙까지 모아 넣기 시작하면 객체지향 설계가 빠르게 약해진다.

## References
- [devkuma: `@UtilityClass`](https://www.devkuma.com/docs/java/lombok/utility-class/)
- [Avoid Utility Classes](https://www.vojtechruzicka.com/avoid-utility-classes/)
- [객체지향 프로그래밍으로 유틸리티 클래스를 대체하자](https://www.mimul.com/blog/oop-alternative-to-utility-classes/)
- [[Java] utility class는 무엇으로 구현하는 것이 좋을까?](https://seoarc.tistory.com/122)
- [Baeldung: Helper vs Utility Classes](https://www.baeldung.com/java-helper-vs-utility-classes)
