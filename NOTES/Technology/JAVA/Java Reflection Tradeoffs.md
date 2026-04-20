---
id: 52
title: "Java Reflection Tradeoffs"
summary: "Java Reflection의 장점과 성능·안전성 비용, 직접 사용 범위를 어떻게 제한할지 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java Reflection Tradeoffs

Reflection은 런타임에 타입 메타데이터를 읽고 객체를 조작할 수 있게 해 준다. DI, 직렬화, ORM, 테스트 도구 같은 프레임워크 기반 기능의 상당수가 여기에 기대고 있다.

## Reflection이 실제로 하는 일

```java
Field field = User.class.getDeclaredField("name");
field.setAccessible(true);
field.set(user, "changed");
```

이처럼 일반 접근 제어를 우회해 필드와 메서드를 다룰 수 있다. 강력하지만, 그만큼 캡슐화와 컴파일러 보호를 벗어나는 비용도 함께 따른다.

## 장점
- 런타임 메타데이터 접근
- 일반 코드로는 어려운 동적 객체 처리
- 프레임워크/도구 계층 구현 가능

즉 Reflection이 없으면 자바 생태계의 많은 자동화가 훨씬 불편해진다.

## 비용
하지만 Reflection은 공짜가 아니다.

- 일반 호출보다 느릴 수 있다
- 캡슐화를 약하게 만든다
- rename/refactor에 취약하다
- 컴파일러의 보호 범위를 벗어난다

그래서 비즈니스 로직의 기본 도구처럼 쓰는 건 보통 과하다.

## 프레임워크가 쓰는 것과 애플리케이션이 직접 쓰는 것은 다르다
Spring, Jackson, Hibernate가 Reflection을 적극 활용한다고 해서 애플리케이션 코드도 직접 Reflection을 많이 써야 한다는 뜻은 아니다. 프레임워크는 그 비용과 위험을 추상화해 주지만, 애플리케이션 코드에서 직접 쓰면 유지보수 비용이 그대로 드러난다.

## 언제 직접 써도 괜찮은가
- 테스트 유틸리티
- 매우 제한된 메타프로그래밍
- 프레임워크/라이브러리 내부 구현

반대로 도메인 로직, 일반 서비스 코드, 빈번한 hot path에서는 가능한 한 피하는 편이 맞다.

## 실무 기준
애플리케이션 코드에서는 Reflection을 직접 쓰기보다, 이미 검증된 프레임워크 API를 통해 간접적으로 사용하는 편이 낫다. 직접 써야 한다면 범위를 좁히고, 한 곳으로 감싸고, 테스트를 충분히 두는 것이 안전하다.

## 대안도 먼저 검토할 가치가 있다
단순 타입 분기나 플러그인 선택 문제라면 reflection보다 인터페이스, 전략 패턴, 명시적 registry가 더 단순할 수 있다. reflection은 "마지막 수단"까지는 아니어도, 일반 코드의 첫 선택지가 되는 편은 아니다.

## 정리
Reflection은 강력하지만 일반 코드의 기본값은 아니다. 프레임워크를 이해하려면 알아야 하고, 애플리케이션 구현에서는 가능한 한 뒤에 숨겨 두는 편이 맞다.

## References
- [Baeldung: Reflection Benefits and Drawbacks](https://www.baeldung.com/java-reflection-benefits-drawbacks)
