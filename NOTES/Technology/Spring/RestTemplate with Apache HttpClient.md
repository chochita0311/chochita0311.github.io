---
id: 81
title: "RestTemplate with Apache HttpClient"
summary: "RestTemplate를 Apache HttpClient와 함께 쓸 때의 연결 풀, timeout, 요청 API 선택 기준을 실무 관점에서 정리한 노트."
tags:
  - technology
  - spring
  - java
created: 2026-04-20
updated: 2026-04-20
---
# RestTemplate with Apache HttpClient

## 한눈에 보기
`RestTemplate`은 이제 신규 권장 API는 아니지만, 여전히 레거시 Spring 서비스에서 가장 흔한 동기 HTTP 클라이언트다. 실무에서 중요한 건 사용법 자체보다 어떤 HTTP client 구현을 붙이는지, 연결 풀과 timeout을 어떻게 잡는지다.

## 기본 구조
`RestTemplate`은 내부적으로 `ClientHttpRequestFactory`를 통해 실제 HTTP 호출 구현체를 바꾼다. 기본 구현으로도 동작하지만, 운영 환경에서는 보통 Apache HttpClient 기반 팩토리를 붙여 연결 풀과 timeout을 제어한다.

이렇게 두는 이유는 다음과 같다.

- 매 요청마다 새 연결을 만드는 비용을 줄일 수 있다.
- keep-alive와 connection pooling을 사용할 수 있다.
- connect/read/connection-request timeout을 명확히 제어할 수 있다.

## Connection Pooling
Apache HttpClient의 `PoolingHttpClientConnectionManager`는 라우트별, 전체 연결 수를 관리한다. 기본값은 작기 때문에 외부 API 호출량이 있는 서비스에서는 명시적으로 조정하는 편이 낫다.

다만 DB 커넥션 풀과 마찬가지로 HTTP 커넥션 풀도 크다고 무조건 좋은 것은 아니다. downstream 서버 처리량보다 큰 풀은 대기 요청만 늘리고 장애 시 복구를 더 어렵게 만들 수 있다.

## Timeout 세 가지
RestTemplate/HttpClient 설정에서 혼동이 많은 부분은 timeout 종류다.

- connect timeout: TCP 연결 수립까지 기다리는 시간
- read/socket timeout: 연결 후 응답 바이트를 읽으면서 기다리는 시간
- connection request timeout: 풀에서 사용 가능한 연결을 빌릴 때 기다리는 시간

이 세 개를 분리해서 봐야 장애 상황을 제대로 해석할 수 있다. 예를 들어 외부 서버가 느린데 connect timeout만 줄여서는 문제를 못 잡는다. 반대로 풀이 고갈된 상황은 read timeout이 아니라 connection request timeout으로 드러난다.

## `SocketConfig`와 `RequestConfig`
Apache HttpClient에서는 `SocketConfig`와 `RequestConfig`가 비슷해 보여 헷갈리기 쉽다. 실무에서는 요청 단위 timeout은 보통 `RequestConfig`를 중심으로 보게 된다. 특히 공유 connection manager를 사용할 때 builder 레벨 설정이 기대대로 적용되지 않는 경우가 있어, 어떤 객체에 timeout을 실었는지 명확히 확인해야 한다.

원문 코드와 이슈 사례를 보면, shared connection manager 구성에서는 일부 builder 설정이 무시될 수 있다. 그래서 설정 위치와 적용 범위를 함께 이해해야 한다.

## Spring에서 등록하는 방식
Spring Boot에서는 `RestTemplateBuilder`를 통해 공통 설정을 넣고 빈으로 등록하는 패턴이 가장 안전하다. 이 방식이면 timeout, 인터셉터, 메시지 컨버터, 기본 헤더를 한곳에서 관리할 수 있다.

`RestTemplate`을 매번 새로 만들기보다, 잘 설정된 빈을 재사용하는 편이 연결 풀 활용과 운영 일관성 면에서 낫다.

## API 선택
`RestTemplate` 자체의 호출 메서드는 많지만, 실무에서는 대체로 세 가지로 정리된다.

- 간단한 GET/POST: `getForObject`, `postForEntity`
- 헤더/상태코드/제네릭 응답을 같이 다룸: `exchange`
- 아주 세밀한 제어가 필요함: `execute`

즉 API 선택은 "편의 메서드냐 일반 메서드냐"의 차이로 보면 된다.

## 정리
RestTemplate의 핵심은 동기 호출 자체보다 연결 관리다. Apache HttpClient 연결 풀, timeout 세 종류, shared connection manager의 설정 범위를 이해하지 않으면 겉보기엔 정상인 코드도 운영에서 쉽게 병목이 된다. 레거시 유지보수 관점에서는 `RestTemplateBuilder`로 공통 설정을 모으고, timeout 의미를 분리해서 보는 것이 가장 중요하다.

## References
- [Configuring HttpClient with Spring RestTemplate](https://howtodoinjava.com/spring-boot2/resttemplate/resttemplate-httpclient-java-config/)
- [[Spring] RestTemplate 싱글톤 등록 및 Connection Pool 설정](https://minnseong.tistory.com/9)
- [Baeldung: RestTemplate](https://www.baeldung.com/rest-template)
- [Baeldung: Apache HttpClient Connection Management](https://www.baeldung.com/httpclient-connection-management)
- [Baeldung: Apache HttpClient Timeout](https://www.baeldung.com/httpclient-timeout)
- [Spring Framework Reference: REST Clients](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#_initialization)
- [Spring Boot 2.x Reference: RestTemplate](https://docs.spring.io/spring-boot/docs/2.0.x/reference/html/boot-features-resttemplate.html)
- [Connection Timeout In Java HTTPClient, RestTemplate and URLConnection](https://www.code4copy.com/java/connection-timeout/)
- [로그의 개발일지: 네이버 블로그](https://blog.naver.com/hj_kim97/222295259904)
- [Apache HttpClient Connection Management](https://gunju-ko.github.io/http/httpclient/2019/01/23/Apache-HttpClient.html)
- [Stack Overflow: `SocketConfig.getSoTimeout()` vs `RequestConfig.getSocketTimeout()`](https://stackoverflow.com/questions/22716086/apache-httpclient-4-3-socketconfig-getsotimeout-vs-requestconfig-getsockettime)
- [Stack Overflow: RequestConfig and IOReactorConfig timeout difference](https://stackoverflow.com/questions/50103715/difference-between-timeout-settings-on-requestconfig-and-ioreactorconfig)
- [Stack Overflow: socket timeout in RequestConfig and SocketConfig](https://stackoverflow.com/questions/27833836/setting-socket-timeout-in-both-requestconfig-and-socketconfig-works-differently)
- [Stack Overflow: what `setSoTimeout` does](https://stackoverflow.com/questions/12820874/what-is-the-functionality-of-setsotimeout-and-how-it-works)
- [Apache HttpClient Tutorial: Connection management](https://hc.apache.org/httpcomponents-client-4.5.x/current/tutorial/html/connmgmt.html)
- [Baeldung: Connection Timeout vs Read Timeout for Java Sockets](https://www.baeldung.com/java-socket-connection-read-timeout)
- [HttpClientBuilder source note](https://github.com/mydevotion/httpclient/blob/master/httpclient/src/main/java/org/apache/http/impl/client/HttpClientBuilder.java)
- [HttpClient Javadoc index](https://javadoc.io/doc/org.apache.httpcomponents/httpclient/latest/index.html)
- [Apache HttpClient Configuration](https://cwiki.apache.org/confluence/display/HTTPCOMPONENTS/HttpClientConfiguration#)
- [SocketConfig.Builder API](https://hc.apache.org/httpcomponents-core-5.1.x/current/httpcore5/apidocs/org/apache/hc/core5/http/io/SocketConfig.Builder.html)
- [SocketConfig API](https://hc.apache.org/httpcomponents-core-4.4.x/current/httpcore/apidocs/org/apache/http/config/SocketConfig.html)
- [Baeldung: exchange(), postForEntity(), execute()](https://www.baeldung.com/spring-resttemplate-exchange-postforentity-execute)
