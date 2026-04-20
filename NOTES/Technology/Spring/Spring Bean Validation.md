---
id: 60
title: "Spring Bean Validation"
summary: "Spring에서 Bean Validation을 붙이는 방식과 `@Valid`, 커스텀 제약의 적용 범위를 실무 관점에서 정리한 노트."
tags:
  - technology
  - spring
  - java
  - validation
  - bean-validation
  - spring-mvc
created: 2026-04-20
updated: 2026-04-20
---
# Spring Bean Validation

Spring에서 Bean Validation은 요청 객체, 서비스 메서드 파라미터, 중첩 객체를 **선언형 제약 조건으로 검증**하기 위한 기본 도구다.  
실무에서는 `@NotNull`, `@Size` 같은 표준 제약부터, enum 검증이나 필드 간 규칙 같은 커스텀 제약까지 같이 다루게 된다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| 목적 | 입력값 검증 로직을 어노테이션 중심으로 선언 |
| 핵심 어노테이션 | `@Valid`, `@Validated`, `@NotNull`, `@Size`, 커스텀 `@Constraint` |
| 적용 위치 | DTO, 중첩 객체, 컬렉션 요소, 메서드 파라미터 |
| 주의점 | 중첩 객체나 리스트는 `@Valid` 전파를 명시해야 함 |

## 1. 기본 개념

Bean Validation은 객체 필드나 메서드 인자에 제약을 붙이고, 런타임에 이를 검증하는 방식이다.  
Spring은 이를 프레임워크 수준에서 잘 연결해 두었고, `LocalValidatorFactoryBean`을 통해 `jakarta.validation.Validator`와 Spring의 `Validator`로 모두 사용할 수 있다.

공식 문서 기준으로 보면 Spring은:

- Bean Validation provider를 Spring bean으로 부트스트랩할 수 있고
- `Validator`를 주입받아 직접 검증할 수 있으며
- 커스텀 `ConstraintValidator`도 Spring DI를 활용할 수 있다

즉, 단순 DTO 검증만이 아니라 **서비스 계층과 커스텀 제약 구현까지 이어지는 검증 인프라**라고 보면 된다.

## 2. `@Valid`와 `@Validated`

실무에서는 둘을 자주 같이 보게 된다.

| 어노테이션 | 주로 쓰는 곳 | 역할 |
| --- | --- | --- |
| `@Valid` | 필드, 파라미터, 중첩 객체 | 객체 그래프 검증 전파 |
| `@Validated` | 클래스, 메서드, 스프링 빈 | 메서드 검증 활성화, 그룹 기반 검증 |

예를 들어 컨트롤러 요청 DTO 검증은 보통 다음 형태다.

```java
public record CreateUserRequest(
    @NotBlank String name,
    @Email String email
) {}
```

```java
public ResponseEntity<Void> create(@RequestBody @Valid CreateUserRequest request) {
    return ResponseEntity.ok().build();
}
```

서비스 메서드 단위 검증은 `@Validated`와 함께 보는 편이 자연스럽다.

## 3. 중첩 객체와 컬렉션 검증

여기서 많이 놓치는 부분이 **검증 전파**다.

중첩 객체나 리스트 내부 객체까지 검증하려면 상위 필드에 `@Valid`를 붙여야 한다.

```java
public class RequestUser {

    @Valid
    @NotNull
    @Size(min = 1)
    private List<SnsAccount> snsAccounts;
}
```

이렇게 해야 `snsAccounts` 자체의 null/size뿐 아니라, 내부 `SnsAccount`의 `@NotNull` 같은 제약도 같이 검사된다.

정리하면:

- 필드 자체만 검사: `@NotNull`, `@Size`
- 내부 객체까지 전파: `@Valid`

## 4. 커스텀 검증이 필요한 경우

표준 제약만으로 부족하면 커스텀 제약을 만든다.  
Baeldung와 커스텀 enum 검증 예시는 둘 다 같은 구조를 보여 준다.

1. `@Constraint` 기반 어노테이션 선언
2. `ConstraintValidator` 구현
3. 필요 시 여러 필드 조합이나 특정 타입 검증에 적용

예를 들어 enum 문자열 검증은 이런 식이다.

```java
public class EnumValidator implements ConstraintValidator<EnumValid, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // enum 상수와 비교
        return true;
    }
}
```

이 방식은 다음 상황에서 유용하다.

- 특정 전화번호 형식 검증
- 두 필드 조합 검증
- 문자열이 특정 enum 집합에 속하는지 검증
- 도메인 정책성 규칙을 어노테이션으로 재사용하고 싶을 때

## 5. 어노테이션 메타데이터도 같이 봐야 한다

커스텀 제약을 만들 때는 실제 검증 로직뿐 아니라 **어디에 붙을 수 있는지**도 중요하다.  
이때 `@Target`이 사용 가능 위치를 결정한다.

예를 들어:

- 필드 검증이면 `FIELD`
- 메서드/파라미터 검증이면 `METHOD`, `PARAMETER`
- 다른 어노테이션 위에 붙는 메타 어노테이션이면 `ANNOTATION_TYPE`

즉, 커스텀 검증이 예상한 위치에서 동작하지 않으면 로직보다 먼저 `@Target`과 선언 위치를 확인해야 한다.

## 6. 실무 체크포인트

- DTO 필드 검증과 메서드 검증을 구분해서 본다.
- 중첩 객체와 리스트 내부 검증에는 `@Valid` 전파를 잊지 않는다.
- 커스텀 제약은 재사용 가치가 있는 규칙에만 만든다.
- enum 문자열 검증처럼 흔한 패턴은 공통 어노테이션으로 묶는 편이 낫다.
- 에러 메시지는 기본 메시지에 의존하지 말고 서비스 문맥에 맞게 관리한다.

## 7. 정리

Bean Validation의 핵심은 단순히 어노테이션을 붙이는 게 아니라, **검증 범위가 어디까지 전파되는지와 커스텀 규칙을 어떻게 재사용 가능한 형태로 올릴지**를 아는 것이다.

실무에서는 보통 아래 순서로 성숙해진다.

1. 표준 제약 사용
2. `@Valid`로 중첩 객체 전파
3. `@Validated`로 메서드 검증 확장
4. 공통 도메인 규칙을 커스텀 제약으로 분리

## References

- https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html
- https://www.baeldung.com/spring-mvc-custom-validator
- https://velog.io/@ysm103408/JAVA-Target-annotation-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0
- https://developerbee.tistory.com/247
- https://lemontia.tistory.com/999
