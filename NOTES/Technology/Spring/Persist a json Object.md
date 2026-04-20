---
id: 75
title: "Persist a JSON Object"
summary: "JPA/Hibernate에서 JSON 데이터를 문자열 컨버터나 JSON 타입 매핑으로 저장하는 방법과 선택 기준을 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Persist a JSON Object

## 한눈에 보기
JPA에서 JSON을 저장하는 방식은 크게 두 갈래다.

- JSON을 문자열 컬럼처럼 보고 `AttributeConverter`로 직렬화/역직렬화한다.
- 데이터베이스의 JSON 타입과 Hibernate의 JSON 매핑을 이용한다.

둘 다 가능하지만, 조회 방식과 DB 기능 활용 수준에 따라 선택이 달라진다.

## `AttributeConverter` 방식
가장 단순한 방법은 애플리케이션 객체를 JSON 문자열로 바꿔 `VARCHAR`나 `TEXT` 컬럼에 저장하는 것이다. 구현은 쉽고 JPA 표준 안에서 해결되지만, DB 입장에서는 그냥 문자열이라 JSON 함수나 인덱싱 이점을 충분히 쓰기 어렵다.

이 방식은 다음 상황에 적합하다.

- DB JSON 함수 사용 계획이 거의 없다.
- 저장과 복원만 필요하다.
- 비교적 단순한 설정으로 시작하고 싶다.

기존 노트에 있던 `Map<String, Object>` + `ObjectMapper` 기반 `AttributeConverter` 예시는 이 접근의 전형적인 형태다.

## Hibernate JSON 타입 매핑
Hibernate 6 이상에서는 JSON 컬럼 타입을 더 직접적으로 다룰 수 있다. MySQL JSON, PostgreSQL JSONB처럼 DB가 JSON 타입을 제공하면, 애플리케이션 쪽에서도 이를 더 자연스럽게 매핑할 수 있다.

이 접근은 다음 장점이 있다.

- 컬럼 타입 의미가 DB에 명확하다.
- DB JSON 함수와 연계하기 쉽다.
- 벤더가 제공하는 JSON 최적화 전략을 활용할 수 있다.

다만 DB 의존성이 커지고, 매핑 방식이 Hibernate 버전과 구현체에 더 민감해진다.

## `hibernate-types` 라이브러리
Hibernate 기본 지원이 부족하던 시기에는 `hibernate-types` 라이브러리가 JSON, 배열, 사용자 정의 타입 매핑을 보완하는 데 많이 쓰였다. 지금도 버전과 환경에 따라 유효하지만, Hibernate 6 이후에는 기본 지원과 비교해서 꼭 필요한 경우에만 선택하는 편이 낫다.

## `ObjectMapper`를 같이 볼 이유
JSON persistence 문제는 DB 매핑만의 문제가 아니다. 결국 직렬화 경계에서 `ObjectMapper` 설정이 데이터 형식에 영향을 준다.

- 날짜/시간 직렬화
- 알 수 없는 필드 처리
- 숫자 타입 해석
- `Map<String, Object>` 사용 시 타입 안정성 저하

특히 `Map<String, Object>`는 빠르게 시작할 수 있지만, 시간이 지나면 구조가 불명확해지고 런타임 캐스팅 비용이 커진다. 구조가 고정적이라면 값 객체를 정의해 명시적으로 매핑하는 쪽이 낫다.

## 선택 기준
- 단순 저장/복원: `AttributeConverter`
- DB JSON 함수 사용, JSON 컬럼 의미 보존: Hibernate JSON 타입 매핑
- 복잡한 JSON 타입 확장 지원이 필요함: `hibernate-types` 검토
- 구조가 명확함: `Map`보다 DTO/VO 매핑 우선

## 정리
JSON을 저장할 수 있다는 것과 JSON을 잘 다루는 것은 다르다. 단순 문자열 저장은 가장 쉬운 출발점이지만, JSON 컬럼을 쿼리하거나 DB 수준 제약과 기능을 활용하려면 Hibernate JSON 매핑 쪽이 더 자연스럽다. 애플리케이션에서는 `ObjectMapper` 설정과 타입 모델링까지 같이 봐야 실제 유지보수성이 나온다.

## References
- [Baeldung: Persist a JSON Object Using Hibernate](https://www.baeldung.com/hibernate-persist-json-object)
- [Baeldung: Hibernate Types Library](https://www.baeldung.com/hibernate-types-library)
- [JPA에서 MySQL JSON 타입 사용하기](https://velog.io/@happyjamy/JPA-%EC%97%90%EC%84%9C-MySql-Json-%ED%83%80%EC%9E%85-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-hibernate-6-%EC%9D%B4%EC%83%81)
- [Jackson ObjectMapper 정리](https://interconnection.tistory.com/137)
- [Baeldung: Jackson ObjectMapper Tutorial](https://www.baeldung.com/jackson-object-mapper-tutorial)
- [Jenkov: Jackson ObjectMapper](https://jenkov.com/tutorials/java-json/jackson-objectmapper.html)
