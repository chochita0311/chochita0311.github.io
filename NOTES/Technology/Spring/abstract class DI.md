---
id: 31
title: "Abstract Class DI"
summary: "추상 클래스에서 Spring DI를 적용할 때 가능한 방식과 권장되지 않는 패턴을 정리한 노트."
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - spring
  - dependency-injection
  - abstract-class
---

# Abstract Class DI

## 한눈에 보기
Spring은 추상 클래스 자체를 빈으로 만들지 않지만, 추상 클래스 안에 공통 의존성 주입 구조를 둘 수는 있다. 다만 어떤 방식으로 주입하느냐에 따라 안정성이 꽤 달라진다.

## 가능한 방식
가장 단순한 방식은 추상 클래스에 protected setter를 두고, 실제 하위 구현 빈에서 주입받는 것이다. 또는 하위 구현 클래스 생성자에서 부모 생성자로 의존성을 전달하는 방식도 가능하다.

이 접근이 무난한 이유는 빈 등록 주체가 항상 구체 클래스라는 점을 분명히 유지하기 때문이다.

## 권장되지 않는 패턴
추상 클래스 필드에 직접 `@Autowired`를 붙이는 방식은 동작할 수는 있지만, 설계가 흐려지기 쉽다. 추상 클래스가 스스로 생성될 수 없는 객체인데도, 마치 주입 주체처럼 보이기 때문이다.

특히 다음 문제가 생기기 쉽다.

- 의존성 요구가 부모에 숨어서 읽기 어려워진다.
- 생성자 기반 명시성이 떨어진다.
- 테스트에서 하위 타입 구성 의도를 파악하기 어렵다.

## 생성자 주입 관점
생성자 주입을 선호한다면, 보통 구체 클래스 생성자가 의존성을 받고 이를 부모 생성자에 전달하는 구조가 가장 명확하다. 추상 클래스는 공통 동작과 상태만 소유하고, 실제 조립 책임은 구체 클래스가 진다는 점이 선명해진다.

```java
public abstract class AbstractNotifier {
    protected final Clock clock;

    protected AbstractNotifier(Clock clock) {
        this.clock = clock;
    }
}

@Component
public class EmailNotifier extends AbstractNotifier {
    public EmailNotifier(Clock clock) {
        super(clock);
    }
}
```

이 구조는 "조립은 구체 클래스에서, 공통 상태는 추상 클래스에서"라는 책임 분리가 가장 잘 드러난다.

## setter 주입을 쓰는 이유
Baeldung 사례처럼 추상 클래스에 final setter를 두고 하위 클래스에서 `@Autowired`로 호출하게 만드는 방식도 있다. 이 패턴은 부모 필드를 보호하면서 하위 클래스가 조립 책임을 지게 만든다는 점에서, 필드 주입보다 낫다.

## 왜 추상 클래스 직접 주입이 어색한가
추상 클래스는 설계상 "공통 베이스"이지, 스스로 조립되어 사용되는 최종 객체가 아니다. 그런데 여기에 직접 주입 어노테이션이 많이 붙기 시작하면, 책임의 중심이 부모로 올라가면서 하위 구현이 무엇을 필요로 하는지 읽기 어려워진다.

## 정리
추상 클래스에서 DI가 아예 불가능한 것은 아니다. 다만 추상 클래스는 공통 동작을 제공하는 기반 타입일 뿐, 빈 조립의 주체는 아니다. 그래서 의존성은 가능하면 구체 클래스에서 명시적으로 받아 부모로 전달하거나, 최소한 하위 클래스가 호출하는 setter를 통해 주입하는 편이 더 읽기 쉽고 안전하다.

## References
- [Baeldung: Using `@Autowired` in Abstract Classes](https://www.baeldung.com/spring-autowired-abstract-class)
- [Use Spring’s Dependency Injection in Java abstract class](https://medium.com/@citizenACLV/use-springs-dependency-injection-in-java-abstract-class-2573c1b4c0d1)
- [Example source code](https://gitlab.com/Lovegiver/springandabstractclass/-/blob/master/AnnotateAbstract-2/src/main/java/com/citizenweb/training/classes/AbstractMyClass.java?ref_type=heads)
