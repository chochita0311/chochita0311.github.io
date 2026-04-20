---
id: 49
title: "No-Args Constructor"
summary: "JPA에서 기본 생성자가 왜 요구되는지와 프록시/리플렉션 관점의 배경, 실무 타협점을 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# No Args Constructor

JPA 엔티티는 기본 생성자를 요구한다. 이유는 구현체가 리플렉션과 프록시를 이용해 엔티티 인스턴스를 만들 수 있어야 하기 때문이다. 보통 `protected` 기본 생성자를 두고, 외부에서는 의미 있는 생성 메서드나 생성자를 따로 노출하는 식으로 균형을 맞춘다.

이 규칙은 설계 미학보다 프레임워크 호환성과 스펙 단순화를 위한 선택에 가깝다.

## 보통 이렇게 둔다

```java
@Entity
public class Member {
    @Id
    @GeneratedValue
    private Long id;

    protected Member() {
    }

    public Member(String name) {
        this.name = name;
    }
}
```

`public`으로 완전히 열기보다 `protected`로 두고, 실제 도메인 생성 경로는 별도 생성자나 정적 팩토리로 노출하는 방식이 가장 흔한 절충안이다.

## 왜 불편해도 유지되나
엔티티를 프레임워크가 생성해야 하기 때문에, 개발자가 항상 완전한 생성 경로를 통제할 수는 없다. 그래서 도메인 모델 관점에서는 다소 어색해 보여도, JPA는 기본 생성자를 공통 규칙으로 둔다.

Spring JPA guide 예제도 기본 생성자를 두는 방향을 그대로 따른다. 결국 중요한 것은 "왜 필요한가"를 이해하고, 그 제약 안에서 외부 API를 얼마나 잘 정리하느냐다.

## 실무에서의 타협점
- 기본 생성자: `protected`
- 외부 생성: 의미 있는 생성자나 정적 팩토리
- 불변식: 기본 생성자가 아니라 공개 API에서 보장

즉 기본 생성자를 열어 둔다고 해서, 도메인 모델이 무조건 빈약해져야 하는 것은 아니다.

## Lombok을 쓸 때도 같은 맥락이다
`@NoArgsConstructor(access = AccessLevel.PROTECTED)` 같은 조합은 이 타협점을 코드로 더 짧게 표현하는 방법일 뿐이다. 핵심은 annotation이 아니라 "프레임워크는 만들 수 있고, 외부 사용자는 함부로 만들기 어렵게 한다"는 의도다.

## 정리
기본 생성자는 좋은 객체 설계의 상징이라기보다, JPA와 타협하기 위한 규칙이다. 중요한 건 그 제약을 인정한 뒤 외부 API를 어떻게 정리할지다.

## References
- [Spring Guide: Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa)
- [Spring, JPA에 기본 생성자가 필요한 이유](https://velog.io/@yebali/Spring-JPA%EC%97%90-%EA%B8%B0%EB%B3%B8-%EC%83%9D%EC%84%B1%EC%9E%90%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%9C-%EC%9D%B4%EC%9C%A0)
- [인프런: no args constructor를 개발자에게 강제하는 이유](https://www.inflearn.com/community/questions/482663/no-args-constructor%EB%A5%BC-%EA%B0%9C%EB%B0%9C%EC%9E%90%EC%97%90%EA%B2%8C-%EA%B0%95%EC%A0%9C%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0)
