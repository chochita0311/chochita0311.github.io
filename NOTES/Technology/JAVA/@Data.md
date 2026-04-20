---
id: 22
title: "@Data"
summary: "Lombok `@Data`가 실제로 생성하는 코드, DTO와 엔티티에서의 적합성 차이, 실무 사용 기준을 정리한 노트."
created: 2026-04-05
updated: 2026-04-20
tags:
  - java
  - lombok
  - data
---

# `@Data`

## 한눈에 보기
Lombok `@Data`는 `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, `@RequiredArgsConstructor`를 한 번에 생성한다. 빠르게 POJO를 만들기엔 편하지만, 생성되는 메서드 조합이 너무 강해서 모델 성격에 따라 안전성과 가독성이 크게 달라진다.

## `@Data`가 실제로 만드는 것
`@Data`를 쓰면 getter 몇 개만 생기는 것이 아니다. 아래 다섯 개를 묶어서 적용하는 것에 가깝다.

```java
@Getter
@Setter
@ToString
@EqualsAndHashCode
@RequiredArgsConstructor
public class MemberDto {
    private final Long id;
    private String name;
}
```

즉 단순히 코드량을 줄여주는 도구가 아니라, 객체의 공개 API를 한 번에 크게 열어 버리는 어노테이션이다. 그래서 "편하니 일단 붙인다"는 태도보다, 이 객체에 setter와 자동 동등성 비교가 정말 필요한지 먼저 보는 편이 맞다.

## DTO에서는 왜 상대적으로 괜찮은가
참고 링크가 말하듯 DTO는 데이터 운반이 목적이라 `@Data`의 이점이 비교적 잘 드러난다. 요청/응답 객체는 보통 생명주기가 짧고, 로직보다 필드 노출이 더 중요하다.

```java
@Data
public class CreateOrderRequest {
    private String ordererName;
    private String address;
    private Integer quantity;
}
```

이런 객체는 getter, setter, `toString()` 자동 생성이 큰 문제를 만들 가능성이 상대적으로 낮다. 다만 응답 DTO가 불변이어야 하거나 생성 시점에 값이 고정돼야 한다면 `@Value`나 명시적 생성자를 쓰는 편이 더 분명할 수 있다.

## 엔티티와 도메인 모델에서는 왜 위험한가
엔티티는 상태 변경 경로, 연관관계, 지연 로딩, 식별자 기반 비교 같은 제약과 함께 움직인다. 그런데 `@Data`는 이 모든 부분에 대해 너무 많은 기본값을 한 번에 적용한다.

```java
@Data
@Entity
public class Order {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;
}
```

이 코드는 겉보기엔 간결하지만 실제로는 아래 위험을 품는다.

- setter가 모두 열려 상태 변경 경로가 사라진다.
- `toString()`이 연관 엔티티를 따라가며 순환 참조나 의도치 않은 로딩을 유발할 수 있다.
- `equals/hashCode()`가 엔티티 식별자 생명주기와 충돌할 수 있다.

그래서 엔티티는 보통 필요한 것만 선택적으로 붙인다.

```java
@Getter
@Entity
public class Order {
    @Id
    @GeneratedValue
    private Long id;

    protected Order() {
    }

    public void changeAddress(String address) {
        // 검증 후 상태 변경
    }
}
```

## `@Data`보다 나은 조합이 자주 있다
- DTO: `@Data` 또는 `@Getter` + `@Setter`
- 불변 값 객체: `@Value`
- 엔티티: `@Getter` + 필요한 생성자 + 명시적 상태 변경 메서드
- 로그 출력이 민감한 객체: `@ToString`도 직접 범위를 통제

핵심은 "이 객체에 무엇을 노출할지"를 어노테이션 조합으로 의도적으로 표현하는 것이다.

## 실무 기준
- 요청/응답 DTO에서는 허용 가능
- JPA Entity, Aggregate, 도메인 모델에는 지양
- 팀 규칙이 없다면 `@Data`보다 필요한 Lombok 어노테이션만 조합
- 동등성 기준이 중요한 객체에서는 `equals/hashCode`를 직접 결정

## 정리
`@Data`는 보일러플레이트를 줄이는 도구이지 모델 설계를 대신해주지 않는다. "한 번에 다 생성"되는 편의성보다 어떤 메서드를 공개하고 어떤 규칙을 숨길지 명시하는 편이 장기 유지보수에 더 낫다.

## References
- [@Data 어노테이션 사용해야 되나?](https://medium.com/mo-zza/data-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC-%EB%90%98%EB%82%98-34d04fb23fea)
