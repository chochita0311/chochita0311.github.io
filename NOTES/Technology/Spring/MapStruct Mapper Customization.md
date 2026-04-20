---
id: 72
title: "MapStruct Mapper Customization"
summary: "MapStruct에서 커스텀 매핑 로직을 붙이는 방법과 단순 필드 복사 이상이 필요할 때 보는 지점을 정리한 노트."
tags:
  - technology
  - spring
  - java
  - mapstruct
  - mapper
created: 2026-04-20
updated: 2026-04-20
---
# MapStruct Mapper Customization

Spring에서 DTO 변환을 다룰 때 MapStruct는 컴파일 타임에 매퍼 코드를 생성해 주는 도구다. 단순 필드 복사뿐 아니라, 의미 있는 타입 변환이 들어갈 때도 구조를 비교적 깔끔하게 유지할 수 있다.

## 한눈에 보기
- 기본 강점: 컴파일 타임 코드 생성
- 잘 맞는 상황: DTO 변환이 많고 규칙이 반복적임
- 커스텀 포인트: 별도 메서드, `qualifiedByName`, expression
- 주의점: mapper가 business rule을 먹기 시작하면 경계가 흐려짐

## 기본 관점
MapStruct의 가장 큰 장점은 reflection 기반 런타임 매핑이 아니라, 실제 자바 코드를 생성한다는 점이다. 그래서 성능이 예측 가능하고, 문제 발생 시 생성된 코드를 따라가며 디버깅하기도 쉽다.

즉 "자동화는 하되 런타임 매직은 줄이고 싶다"는 요구와 잘 맞는다.

## 커스텀 매핑이 필요한 순간

- enum/코드값을 설명 문자열로 바꿀 때
- 중첩 객체 일부만 평탄화할 때
- 단순 getter/setter 복사로 끝나지 않는 타입 변환이 필요할 때
- 단위 변환이나 포맷 변환이 들어갈 때

Baeldung 예시처럼 `qualifiedByName`이나 별도 메서드를 이용하면, 변환 규칙을 mapper 안에서 명시적으로 드러낼 수 있다.

```java
@Mapper
public interface UserMapper {
    @Mapping(source = "inch", target = "centimeter", qualifiedByName = "inchToCentimeter")
    UserBodyValues toMetric(UserBodyImperialValuesDTO dto);

    @Named("inchToCentimeter")
    static double inchToCentimeter(int inch) {
        return inch * 2.54;
    }
}
```

이런 코드는 "자동 매핑으로는 부족한 지점만 수동으로 끼워 넣는다"는 의도를 잘 보여 준다.

## 실무 포인트

- 단순 매핑은 자동 매핑에 맡기고
- 의미가 있는 변환만 별도 메서드로 올리는 편이 읽기 쉽다
- mapper가 business rule까지 먹기 시작하면 범위를 다시 봐야 한다

## 왜 경계가 중요하나
MapStruct는 구조 변환에는 강하지만, 도메인 판단까지 넣기 시작하면 mapper가 서비스 로직처럼 비대해진다. 예를 들어 "특정 상태면 다른 값을 넣는다" 수준의 판단이 많아지면, 그건 단순 매핑이 아니라 비즈니스 규칙에 가까워진다.

그래서 보통은 다음처럼 나누는 편이 좋다.

- 구조 변환: mapper
- 의미 판단/정책: service 또는 domain
- 표현 전용 포맷 조정: mapper 또는 view model 조립 계층

## 정리

MapStruct 커스텀 매핑의 핵심은 기능이 아니라 경계다. 반복적인 DTO 변환을 줄이는 데는 아주 좋지만, mapper 안에 비즈니스 규칙까지 밀어 넣기 시작하면 이점이 빠르게 사라진다. 구조 변환과 의미 판단을 분리하는 쪽이 유지보수에 유리하다.

## References
- https://www.baeldung.com/mapstruct-custom-mapper
