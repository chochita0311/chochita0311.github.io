---
id: 67
title: "Hibernate Parameter Padding"
summary: "IN clause parameter padding이 왜 statement cache 효율에 도움이 되는지와 언제 켜 볼 만한지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - hibernate
  - query-optimization
created: 2026-04-20
updated: 2026-04-20
---
# Hibernate parameter padding

`hibernate.query.in_clause_parameter_padding`은 `IN` 절 파라미터 개수가 매번 달라질 때 statement cache와 execution plan cache 효율을 높이기 위한 옵션이다.

## 한눈에 보기
- 문제 상황: `IN` 절 길이가 계속 달라짐
- 결과: SQL text가 매번 달라져 cache reuse가 줄어듦
- padding 역할: SQL shape를 덜 다양하게 만듦
- 기대 효과: statement cache / execution plan cache hit 증가

## 왜 필요한가

기본적으로:

```sql
where id in (?, ?, ?)
where id in (?, ?, ?, ?)
```

처럼 파라미터 개수가 다르면 DB 입장에서는 서로 다른 SQL로 보게 된다.  
그러면 plan cache 재사용이 줄어든다.

특히 `IN` 절을 많이 쓰는 검색이나 batch 조회가 반복되면, 논리적으로는 비슷한 쿼리인데도 SQL 모양이 계속 바뀌는 일이 생긴다. 이게 cache 입장에서는 비효율이다.

## padding이 하는 일

Vlad Mihalcea 설명처럼 padding을 켜면 Hibernate가 파라미터 개수를 일정 패턴으로 맞추기 위해 마지막 값을 반복해 채운다.

예:

- 3개 → 4개로 padding
- 5개 → 8개로 padding

이렇게 SQL shape를 줄여 cache hit 가능성을 높인다.

핵심은 "값이 아니라 모양"을 맞추는 것이다. 즉 더 적은 종류의 SQL 텍스트로 수렴시키려는 전략이라고 보면 된다.

## 설정

```properties
hibernate.query.in_clause_parameter_padding=true
```

## 언제 효과를 기대하나

- `IN` 절 길이가 자주 달라지는 조회가 많을 때
- DB가 execution plan cache를 적극적으로 쓰는 환경일 때
- 같은 종류의 조회가 반복적으로 발생할 때

반대로 `IN` 절이 거의 없거나, 조회 패턴이 매우 다양해 재사용성이 낮으면 체감 효과가 크지 않을 수 있다.

## 주의점

- 모든 쿼리에 만능 최적화는 아니다
- 실제 효과는 DB, 트래픽 패턴, `IN` 절 사용 빈도에 따라 다르다
- 성능 문제의 본질이 인덱스/카디널리티/네트워크라면 padding만으로는 해결되지 않는다

즉 이 옵션은 statement cache 효율 개선용이지, 쿼리 품질 자체를 바꾸는 기능은 아니다.

## 정리

이 옵션의 핵심은 SQL 형태를 덜 다양하게 만들어 cache reuse를 높이는 것이다. `IN` 절 길이가 자주 흔들리는 시스템이라면 켜 볼 가치가 있지만, 항상 만능 최적화처럼 기대하면 안 된다.

## References

- https://meetup.nhncloud.com/posts/211
- https://vladmihalcea.com/improve-statement-caching-efficiency-in-clause-parameter-padding/
- https://www.manty.co.kr/bbs/detail/develop?id=98
- https://www.baeldung.com/java-hibernate-in-clause-padding
