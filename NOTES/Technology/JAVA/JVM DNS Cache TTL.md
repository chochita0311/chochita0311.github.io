---
id: 38
title: "JVM DNS Cache TTL"
summary: "JVM DNS cache와 TTL 설정이 주소 갱신 반영 시간, failover, 외부 의존성 장애 대응에 어떤 영향을 주는지 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# JVM DNS Cache TTL

JVM은 DNS 조회 결과를 자체적으로 캐시할 수 있다. 이 설정이 길면 도메인 IP가 바뀌어도 애플리케이션은 한동안 예전 주소를 계속 쓸 수 있다. 클라우드 환경에서는 이 값이 장애 복구와 라우팅 변경 반영 속도에 직접 영향을 준다.

## 왜 중요한가
운영에서는 서비스 주소가 그대로여도, 그 뒤의 실제 IP는 언제든 바뀔 수 있다. 로드밸런서 교체, 장애 조치, Redis failover, 외부 API 인프라 변경 같은 상황에서 JVM이 오래된 DNS 결과를 계속 들고 있으면 애플리케이션만 혼자 예전 주소를 바라보게 된다.

네이버페이 기술 블로그의 실험도 이 지점을 보여 준다. 애플리케이션 로직은 멀쩡해 보여도 JVM이 예전 IP를 계속 재사용하면 GSLB나 failover 구성이 기대만큼 빨리 반영되지 않을 수 있다.

## 핵심 설정
실무에서 가장 먼저 보는 값은 `networkaddress.cache.ttl`이다. 이 값이 너무 길면 갱신 반영이 느리고, 너무 짧으면 DNS 조회 비용이 늘 수 있다.

보통은 JVM 옵션이나 보안 속성으로 이 값을 조정한다.

```bash
-Dsun.net.inetaddr.ttl=30
```

또는 Java 보안 설정에서 `networkaddress.cache.ttl`을 조정한다. 링크 글이 정리하듯 운영 환경마다 시스템 프로퍼티와 security property가 적용되는 지점이 달라 혼동하기 쉽기 때문에, 실제 배포 환경에서 어떤 설정이 먹는지 확인하는 것이 중요하다.

## 왜 "가끔 연결이 안 된다" 같은 증상으로 보이나
DNS 캐시 문제는 장애 양상이 애매한 경우가 많다. 애플리케이션은 정상 실행 중이고 도메인 이름도 그대로인데, 일부 인스턴스만 오래된 IP를 붙잡고 있어서 특정 시점부터 연결 오류가 나기도 한다. 그래서 코드 버그보다 네트워크 또는 대상 서버 문제처럼 보이기 쉽다.

## 체감되는 장애 시나리오
- 클라우드 환경에서 endpoint IP가 자주 바뀜
- failover가 빠르게 반영되어야 함
- 외부 의존성이 DNS 기반 라우팅을 사용함
- GSLB, Redis, 메시지 브로커 같은 인프라를 DNS 이름으로 붙음

이때는 애플리케이션 코드보다 먼저 JVM DNS cache 설정을 의심하는 편이 맞다.

## 너무 짧게 잡는 것도 답은 아니다
TTL을 무작정 0에 가깝게 줄이면 DNS 조회 비용과 외부 DNS 의존성이 커진다. 결국 중요한 것은 "최대 얼마 동안 예전 IP를 써도 되는가"라는 운영 요구사항이다. 장애 복구 목표 시간과 DNS 조회 비용을 함께 봐야 한다.

## 실무 기준
- 외부 의존성이 DNS 기반 failover를 쓴다면 JVM DNS TTL을 명시적으로 관리
- 로컬/개발/운영의 기본값이 다를 수 있으니 환경별 확인
- 연결 장애가 지속되면 애플리케이션 재시작보다 TTL 설정부터 점검

## 함께 봐야 할 것
- 애플리케이션 HTTP 클라이언트의 connection pool 재사용 정책
- OS 레벨 DNS 캐시
- 대상 인프라의 실제 TTL 값

즉 JVM TTL만 맞춘다고 끝나는 문제는 아니다. 다만 Java 애플리케이션에서는 이 설정이 첫 번째 점검 포인트가 되는 경우가 많다.

## 정리
JVM DNS cache TTL은 자바 애플리케이션이 네트워크 변화를 얼마나 늦게 또는 빠르게 따라갈지를 결정하는 운영 설정이다. 연결 문제를 코드 버그로 보기 전에 DNS 캐시 설정부터 확인할 가치가 크다.

## References
- [JVM의 DNS Cache 설정에 따른 갱신시간 테스트](https://medium.com/naverfinancial/jvm%EC%9D%98-dns-cache-%EC%84%A4%EC%A0%95%EC%97%90-%EB%94%B0%EB%A5%B8-%EA%B0%B1%EC%8B%A0%EC%8B%9C%EA%B0%84-%ED%85%8C%EC%8A%A4%ED%8A%B8-c66d7b871302)
- [DNS Cache TTL 설정](https://hongchangsub.com/dns-cache-ttl/)
