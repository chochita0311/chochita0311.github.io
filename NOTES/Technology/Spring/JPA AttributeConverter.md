---
id: 59
title: "JPA AttributeConverter"
summary: "JPA `AttributeConverter`가 필요한 이유와 enum·커스텀 값 매핑에서 `@Enumerated`와 어떻게 다른지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - jpa
  - hibernate
  - attribute-converter
created: 2026-04-20
updated: 2026-04-20
---
# JPA AttributeConverter

`AttributeConverter`는 엔티티 필드와 DB 컬럼 사이의 표현 차이를 직접 제어하고 싶을 때 쓰는 JPA 기능이다.  
실무에서는 enum 저장 방식, 값 객체 직렬화, 외부 시스템 코드값 매핑 같은 상황에서 자주 등장한다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| 목적 | 엔티티 속성과 DB 컬럼 값 사이의 변환을 명시적으로 제어 |
| 잘 맞는 경우 | enum 코드값 저장, 커스텀 포맷 저장, 도메인 값 객체 매핑 |
| 대안 | `@Enumerated`, 별도 엔티티 분리, DB native type 사용 |
| 주의점 | 변환 규칙이 바뀌면 기존 데이터와 호환성 문제가 생길 수 있음 |

## 1. 왜 필요한가

JPA는 기본적으로 단순 타입은 바로 저장하고, enum은 `@Enumerated`로 `ORDINAL` 또는 `STRING` 방식으로 저장할 수 있다.  
하지만 실무에서는 이 두 방식만으로 부족한 경우가 많다.

대표적인 예:

- enum 이름이 아니라 별도 코드값을 저장하고 싶을 때
- DB에는 짧은 문자나 숫자로 저장하고, 코드에서는 더 풍부한 타입을 쓰고 싶을 때
- 특정 값 객체를 문자열이나 다른 컬럼 표현으로 바꿔 저장하고 싶을 때

## 2. `@Enumerated`와의 차이

참고한 JPA enum 매핑 정리에서 핵심은 아래와 같다.

| 방식 | 특징 | 주의점 |
| --- | --- | --- |
| `@Enumerated(ORDINAL)` | 저장 공간이 작고 단순 | enum 순서가 바뀌면 기존 데이터가 깨질 수 있음 |
| `@Enumerated(STRING)` | 읽기 쉽고 순서 변경에 강함 | enum 이름 변경 시 영향이 있음 |
| `AttributeConverter` | 저장 형식을 직접 정의 가능 | 변환 규칙 자체를 직접 관리해야 함 |

즉, `AttributeConverter`는 기본 매핑보다 유연하지만, 그만큼 **저장 규칙의 안정성을 직접 책임지는 선택지**다.

## 3. 어떤 식으로 동작하나

핵심 구조는 두 메서드다.

```java
@Converter
public class StatusConverter implements AttributeConverter<Status, String> {

    @Override
    public String convertToDatabaseColumn(Status attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public Status convertToEntityAttribute(String dbData) {
        return Status.fromCode(dbData);
    }
}
```

| 메서드 | 역할 |
| --- | --- |
| `convertToDatabaseColumn` | 엔티티 값을 DB 저장 형태로 바꿈 |
| `convertToEntityAttribute` | DB 값을 엔티티 타입으로 복원 |

그리고 엔티티 필드에 적용한다.

```java
@Convert(converter = StatusConverter.class)
private Status status;
```

## 4. 실무에서 자주 쓰는 패턴

### 4-1. enum 코드값 저장

가장 흔한 사용처다. 예를 들어 코드에서는 `APPROVED`, `REJECTED` 같은 enum을 쓰지만, DB에는 `A`, `R` 같은 짧은 코드만 저장할 수 있다.

이 경우 장점은 다음과 같다.

- DB 저장값을 시스템 간 계약에 맞출 수 있음
- enum 순서 변화에 덜 민감함
- 이름과 저장값을 분리할 수 있음

### 4-2. 값 객체를 단일 컬럼으로 저장

간단한 값 객체를 JSON, 문자열, 압축된 코드 등으로 저장할 때도 가능하다.  
다만 값 객체 구조가 복잡해질수록 단일 컬럼 변환보다는 별도 모델링이 더 나을 수 있다.

## 5. 주의할 점

- 변환 규칙은 한 번 정하면 쉽게 바꾸지 않는 편이 좋다.
- `convertToEntityAttribute`에서 알 수 없는 DB 값이 들어왔을 때의 처리 전략을 정해야 한다.
- enum 이름 변경보다 저장 코드 변경이 더 위험할 수 있다.
- 검색, 정렬, 통계가 자주 필요한 값이라면 저장 형식이 DB 친화적인지도 같이 봐야 한다.

특히 아래 상황은 미리 생각해야 한다.

| 상황 | 체크 포인트 |
| --- | --- |
| 신규 enum 값 추가 | 기존 변환 로직과 호환되는가 |
| 레거시 코드값 존재 | 복원 로직에서 안전하게 처리하는가 |
| 운영 데이터 오염 가능성 | 예외를 던질지, fallback을 둘지 정했는가 |

## 6. 정리

`AttributeConverter`는 단순한 문법 기능보다 **도메인 표현과 저장 표현을 분리하는 도구**로 보는 게 맞다.

기본 enum 저장이면 `@Enumerated(STRING)`으로 충분한 경우가 많다.  
하지만 저장 코드, 외부 계약, 레거시 포맷 같은 요구가 있으면 `AttributeConverter`가 더 안정적인 선택이 될 수 있다.

## References

- https://www.baeldung.com/jpa-persisting-enums-in-jpa
