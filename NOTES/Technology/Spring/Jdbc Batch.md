---
id: 71
title: "JDBC Batch"
summary: "Spring JDBC batch 작업의 기본 동작, 배치 크기와 커넥션 풀 조정 포인트, MySQL/HikariCP 실무 설정을 함께 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Jdbc Batch

## 한눈에 보기
JDBC batch는 SQL을 한 번에 묶어 네트워크 왕복과 파싱 비용을 줄이는 기법이다. Spring에서는 주로 `JdbcTemplate.batchUpdate()`로 접근하고, 핵심 성능은 "배치를 얼마나 잘게 또는 크게 나누는가", "드라이버가 실제 rewrite를 지원하는가", "커넥션 풀이 이를 받쳐주는가"에 달려 있다.

## `JdbcTemplate.batchUpdate()`의 의미
`batchUpdate()`는 여러 SQL을 동시에 병렬 실행하는 API가 아니다. 호출 스레드 안에서 JDBC batch를 구성하고, 드라이버가 이를 한 번에 전송하거나 최적화할 기회를 주는 방식이다. 따라서 이 메서드 자체가 멀티스레드 성능을 제공한다고 보면 안 된다.

즉 성능 향상 포인트는 다음이다.

- round trip 감소
- SQL 파싱/prepare 재사용
- 드라이버의 batch rewrite 최적화
- 트랜잭션 경계 내 대량 쓰기 처리

## 배치 크기
배치 크기는 항상 크다고 좋은 것이 아니다. 너무 작으면 이득이 적고, 너무 크면 메모리 사용량과 락 점유 시간이 커진다. 실무에서는 보통 수백 단위부터 시작해서 DB와 드라이버 특성에 맞춰 조정한다.

특히 MySQL 계열에서는 `rewriteBatchedStatements=true` 설정 여부가 체감 차이를 만든다. 이 옵션이 없으면 기대만큼 묶이지 않을 수 있다.

## 대량 쓰기에서 같이 봐야 할 것
배치 insert나 update를 빠르게 만든다고 해서 전체 처리량이 자동으로 좋아지지는 않는다. 다음 조건이 같이 맞아야 한다.

- 인덱스 개수가 과도하지 않은가
- 불필요한 auto-commit 전환이 반복되지 않는가
- 커넥션 풀 크기가 과도하게 크지 않은가
- 애플리케이션이 너무 많은 동시 writer를 만들지 않는가

여기서 특히 커넥션 풀은 "클수록 빠르다"가 아니다. HikariCP 문서와 pool sizing 가이드는 오히려 작은 풀에서 더 나은 응답 시간을 얻는 경우를 강조한다. DB CPU, 디스크, 네트워크가 실제 병목인데 연결 수만 늘리면 컨텍스트 스위칭과 경합만 커진다.

## HikariCP와 함께 볼 설정
Jdbc batch를 다룰 때는 HikariCP를 별개 주제가 아니라 같은 성능 경로로 보는 편이 낫다.

- `maximumPoolSize`: DB가 감당할 동시성보다 크게 잡지 않는다.
- `autoCommit`: 트랜잭션 전략과 맞추고 불필요한 토글 비용을 줄인다.
- MySQL 드라이버 옵션:
  - `cachePrepStmts=true`
  - `prepStmtCacheSize`
  - `prepStmtCacheSqlLimit`
  - `useServerPrepStmts=true`
  - `rewriteBatchedStatements=true`
  - `elideSetAutoCommits=true`

배치 성능은 JDBC API 하나가 아니라 드라이버, 커넥션 풀, DB 설정이 같이 맞아야 나온다.

## Update 배치와 조건 설계
bulk update는 insert보다 더 조심해야 한다. `WHERE` 조건이 넓으면 큰 범위를 잠그고, row-by-row 갱신으로 이어질 수 있다. 상황에 따라 단일 대형 update보다 범위를 나눠 처리하거나, 임시 테이블/조인 기반 방식이 더 안전할 수 있다.

## MyBatis와의 관계
MyBatis도 결국 JDBC 위에서 batch를 사용한다. 즉 Spring JDBC, MyBatis, JPA 중 어느 계층을 쓰더라도 DB에 도달하는 순간 병목은 비슷한 축에서 결정된다. 프레임워크를 바꾸는 것보다 batch 크기, SQL 모양, 커넥션 풀 설정을 먼저 보는 편이 보통 더 효과적이다.

## 정리
`JdbcTemplate.batchUpdate()`는 대량 쓰기의 출발점일 뿐이다. 실무 성능은 batch 크기, 드라이버의 rewrite 지원, MySQL 옵션, HikariCP pool sizing, auto-commit 전략까지 맞물려 결정된다. 그래서 JDBC batch는 API 사용법보다 "전송 단위와 연결 자원 관리"를 함께 보는 게 핵심이다.

## References
- [Baeldung: Spring JDBC Batch Inserts](https://www.baeldung.com/spring-jdbc-batch-inserts)
- [Baeldung: Spring JDBC / JdbcTemplate](https://www.baeldung.com/spring-jdbc-jdbctemplate)
- [Spring JDBC를 통한 Batch Insert](https://velog.io/@qotndus43/Batch-Insert)
- [[Spring] Spring Jdbc - batchUpdate()를 사용한 bulk Insert 최적화](https://gksdudrb922.tistory.com/154)
- [Stack Overflow: is `JdbcTemplate.batchUpdate` multithreaded?](https://stackoverflow.com/questions/58817726/is-jdbctemplate-batchupdate-multithreaded-or-concurrent)
- [Spring JdbcTemplate batch update with max performance](https://javabydeveloper.com/spring-jdbctemplate-batch-update-with-maxperformance/)
- [Stack Overflow: bulk update mysql with where statement](https://stackoverflow.com/questions/35726910/bulk-update-mysql-with-where-statement)
- [HikariCP GitHub](https://github.com/brettwooldridge/HikariCP)
- [HikariCP Wiki: About Pool Sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing)
- [DB Connection Pool 이해](https://hyuntaeknote.tistory.com/12)
- [[HikariCP] set autocommit 개선을 통한 성능 최적화](https://velog.io/@haron/Spring-set-autocommit-%EA%B0%9C%EC%84%A0%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94%EB%A5%BC-%ED%95%B4%EB%B3%B4%EC%9E%90)
- [Hikari Configuration for MySQL with Spring Boot 2](https://springframework.guru/hikari-configuration-for-mysql-in-spring-boot-2/)
- [Baeldung: HikariCP](https://www.baeldung.com/hikaricp)
- [HikariCP Maximum Pool Size 설정 시 고려할 부분](https://jaehun2841.github.io/2020/01/27/2020-01-27-hikaricp-maximum-pool-size-tuning/#%EC%B0%B8%EA%B3%A0)
- [우아한형제들: HikariCP Dead lock에서 벗어나기 이론편](https://techblog.woowahan.com/2664/)
- [우아한형제들: HikariCP Dead lock에서 벗어나기 실전편](https://techblog.woowahan.com/2663/)
- [Spring Boot Hikari Connection Pool Configurations](https://roytuts.com/spring-boot-hikari-connection-pool-configurations/)
- [HikariCP README configuration](https://github.com/brettwooldridge/HikariCP#gear-configuration-knobs-baby)
- [HikariCP Wiki: MySQL Configuration](https://github.com/brettwooldridge/HikariCP/wiki/MySQL-Configuration)
- [MyBatis Java API](https://mybatis.org/mybatis-3/ko/java-api.html)
- [[MyBatis] 생성한 키(PK) 리턴받기](https://myeongdev.tistory.com/38)
