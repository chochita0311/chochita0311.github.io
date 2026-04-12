---
id: 35
title: Kafka
summary: Kafka의 개념, 내부 구조, partition, consumer lag, 장애 대응, 활용 예시를 한 번에 복습할 수 있도록 정리한 노트.
created: 2026-04-07
updated: 2026-04-07
tags:
  - kafka
  - messaging
  - event-streaming
  - distributed-system
  - pub-sub
---

# Kafka

Kafka는 단순한 메시지 큐라기보다, **이벤트를 로그 형태로 저장하고 여러 소비자가 독립적으로 읽어 가는 분산 스트리밍 플랫폼**에 가깝다.  
실무에서는 이벤트 기반 아키텍처, 로그 수집, 데이터 파이프라인, 비동기 연동에 자주 사용된다.

## 한눈에 보기

| 항목         | 설명                                                      |
| ------------ | --------------------------------------------------------- |
| 한 줄 정의   | 대용량 이벤트 스트림을 저장하고 전달하는 분산 로그 시스템 |
| 데이터 모델  | Queue가 아니라 append-only log                            |
| 소비 방식    | Consumer가 offset 기준으로 pull                           |
| 강점         | 재처리, 확장성, 다중 소비, 이벤트 보존                    |
| 잘 맞는 상황 | 이벤트 기반 아키텍처, 로그 수집, CDC, 실시간 분석         |
| 주의할 점    | partition 설계, consumer lag, 중복 처리, 운영 복잡성      |

## 목차

1. Kafka가 하는 일
2. 핵심 구성 요소
3. Topic, Partition, Offset
4. Producer와 Consumer 동작 방식
5. Kafka가 자주 쓰이는 이유
6. 다른 MQ와의 관점 차이
7. 사용 예시
8. 운영 시 자주 보는 이슈
9. 장애 상황과 대응
10. 정리

## 1. Kafka가 하는 일

Kafka는 보통 아래 3가지를 동시에 수행한다.

| 역할                  | 설명                                                   |
| --------------------- | ------------------------------------------------------ |
| 메시지 전달           | Producer가 보낸 이벤트를 Consumer에게 전달             |
| 데이터 저장           | 이벤트를 일정 기간 디스크에 유지                       |
| 스트림 처리 기반 제공 | 여러 시스템이 같은 이벤트를 각자 다른 목적에 맞게 소비 |

핵심은 "읽고 끝나는 메시지"가 아니라, **"기록해 두고 필요하면 다시 읽을 수 있는 이벤트"**라는 점이다.

## 2. 핵심 구성 요소

| 구성 요소      | 설명                                             |
| -------------- | ------------------------------------------------ |
| Producer       | Kafka에 레코드를 쓰는 애플리케이션               |
| Broker         | Kafka 서버. Topic/Partition 데이터를 저장        |
| Topic          | 이벤트를 구분하는 논리적 카테고리                |
| Partition      | Topic을 나눈 실제 저장 단위이자 병렬 처리 단위   |
| Consumer       | Topic의 데이터를 읽는 애플리케이션               |
| Consumer Group | 여러 Consumer가 파티션을 나눠 처리하기 위한 그룹 |
| Offset         | 각 Partition에서 메시지의 위치를 나타내는 번호   |

### 흐름

```text
Producer -> Topic -> Partition -> Consumer Group -> Consumer
```

## 3. Topic, Partition, Offset

### Topic

Topic은 이벤트를 분류하는 이름이다. 예를 들어 `order-created`, `payment-completed`, `user-click` 같은 식으로 나눌 수 있다.

### Partition

Partition은 Kafka에서 가장 중요한 개념 중 하나다.

> Partition은 메시지를 나누어 저장하는 단위이자, 병렬 처리의 최소 단위다.

#### Partition이 필요한 이유

| 이유      | 설명                                            |
| --------- | ----------------------------------------------- |
| 병렬 처리 | Partition 수만큼 Consumer를 병렬로 붙일 수 있음 |
| 확장성    | 여러 Broker에 분산 저장 가능                    |
| 순서 보장 | Partition 내부에서는 순서 보장                  |

#### 예시

```text
Topic: order-events

Partition 0 -> [msg1, msg2, msg3]
Partition 1 -> [msg4, msg5, msg6]
Partition 2 -> [msg7, msg8, msg9]
```

### Offset

Offset은 Partition 안에서 메시지가 몇 번째 위치에 있는지를 나타낸다.

| 항목      | 설명                                      |
| --------- | ----------------------------------------- |
| 의미      | 메시지 위치 번호                          |
| 관리 주체 | Consumer 또는 Consumer Group              |
| 활용      | 어디까지 읽었는지 추적, 재처리, 장애 복구 |

Kafka에서는 Consumer가 offset을 기준으로 데이터를 읽기 때문에, 같은 데이터를 다시 읽는 것도 가능하다.

## 4. Producer와 Consumer 동작 방식

### Producer

Producer는 Topic으로 데이터를 전송한다. 이때 key를 주면 같은 key는 같은 Partition으로 들어가도록 라우팅할 수 있다.

```java
ProducerRecord<String, String> record =
    new ProducerRecord<>("order-events", "user-123", "order-created");

kafkaProducer.send(record);
```

위 코드에서 `"user-123"` 같은 key를 사용하면, 같은 사용자 이벤트가 같은 Partition에 들어가도록 유도할 수 있다.  
이렇게 하면 특정 엔티티 단위의 순서를 유지하기 쉽다.

### Consumer

Consumer는 Broker가 push 해주는 방식이 아니라, 직접 pull 해서 읽는다.

```java
ConsumerRecords<String, String> records =
    kafkaConsumer.poll(Duration.ofMillis(100));

for (ConsumerRecord<String, String> record : records) {
    System.out.println(record.topic());
    System.out.println(record.partition());
    System.out.println(record.offset());
    System.out.println(record.value());
}
```

### Consumer Group

같은 Consumer Group 안에서는 하나의 Partition을 동시에 하나의 Consumer만 읽는다.

| Partition 수 | Consumer 수 | 결과                                  |
| ------------ | ----------- | ------------------------------------- |
| 3            | 1           | 한 Consumer가 3개 Partition 모두 처리 |
| 3            | 3           | 각 Consumer가 1개씩 분담              |
| 3            | 5           | 2개 Consumer는 idle 상태              |

즉, **Partition 수가 곧 최대 병렬 처리 가능 수**에 가깝다.

## 5. Kafka가 자주 쓰이는 이유

### 5-1. 이벤트를 보관할 수 있다

Kafka는 메시지를 일정 기간 보존한다.  
그래서 Consumer가 잠시 멈췄거나, 나중에 다른 시스템이 같은 이벤트를 다시 활용해야 할 때 유리하다.

### 5-2. 재처리가 쉽다

offset을 다시 조정하면 특정 시점부터 다시 읽을 수 있다.

활용 예시는 다음과 같다.

| 상황             | Kafka가 유리한 이유                         |
| ---------------- | ------------------------------------------- |
| 장애 복구        | Consumer가 놓친 구간을 다시 읽을 수 있음    |
| 집계 재생성      | 과거 이벤트를 기반으로 다시 계산 가능       |
| 신규 서비스 연결 | 기존 이벤트를 새로운 Consumer가 재사용 가능 |

### 5-3. 대용량 처리에 강하다

Kafka는 append-only 로그 구조와 sequential write 특성 덕분에 높은 처리량에 강하다.  
대량 로그, 클릭 이벤트, 서비스 이벤트 스트림을 다루기에 적합하다.

### 5-4. Producer와 Consumer를 느슨하게 분리할 수 있다

주문 서비스가 이벤트만 발행하면, 배송/알림/분석 시스템이 각자 독립적으로 같은 이벤트를 소비할 수 있다.

```text
Order Service
  -> Kafka(order-created)
    -> Payment Service
    -> Shipping Service
    -> Notification Service
    -> Analytics Service
```

## 6. 다른 MQ와의 관점 차이

Kafka는 다른 MQ와 목적이 완전히 같지는 않다.  
비교는 필요하지만, Kafka를 단순히 "메시지 큐의 한 종류"로만 이해하면 구조적 차이를 놓치기 쉽다.

| 항목        | Kafka                                  | RabbitMQ                     | SQS                                         |
| ----------- | -------------------------------------- | ---------------------------- | ------------------------------------------- |
| 기본 관점   | 분산 로그 / 이벤트 스트림              | 메시지 브로커 / 큐           | 완전 관리형 큐 서비스                       |
| 메시지 보존 | 일정 기간 유지                         | 보통 소비 후 제거            | 소비 후 삭제                                |
| 재처리      | 쉬움                                   | 상대적으로 불편              | 재수신은 가능하지만 로그 재생 개념과는 다름 |
| 소비 방식   | Pull                                   | 주로 Push 기반               | Polling                                     |
| 대표 용도   | 이벤트 스트림, 로그, 데이터 파이프라인 | 작업 큐, 라우팅, 비동기 처리 | AWS 내 비동기 작업 큐                       |

정리하면 다음과 같이 이해하면 편하다.

| 시스템   | 더 잘 맞는 질문                                       |
| -------- | ----------------------------------------------------- |
| Kafka    | "이벤트를 저장하고 여러 시스템이 다시 읽어야 하는가?" |
| RabbitMQ | "작업을 빠르게 전달하고 처리 완료를 관리해야 하는가?" |
| SQS      | "운영 부담 없이 관리형 큐가 필요한가?"                |

## 7. 사용 예시

### 7-1. 주문 이벤트 전파

```text
Order Service
  -> order-created topic
    -> Payment Consumer
    -> Inventory Consumer
    -> Notification Consumer
```

이 구조의 장점은 주문 서비스가 후속 시스템을 직접 호출하지 않아도 된다는 점이다.

### 7-2. 로그 수집

애플리케이션 로그, 사용자 행동 로그, 클릭 이벤트를 Kafka로 모은 뒤 저장소나 분석 플랫폼으로 흘려보낼 수 있다.

### 7-3. CDC와 데이터 파이프라인

DB 변경 사항을 이벤트로 흘려보내고, 이를 바탕으로 검색 인덱스, 통계 테이블, 데이터 웨어하우스를 갱신하는 구조에 자주 쓰인다.

### 7-4. 집계 재생성

과거 이벤트를 다시 읽어 통계, 스냅샷, 집계 결과를 재생성할 수 있다.  
이 특성 때문에 "현재 상태만 저장하는 시스템"보다 복구와 분석에 유리한 경우가 있다.

## 8. 운영 시 자주 보는 이슈

### 8-1. Consumer Lag

Consumer Lag은 Producer가 쌓는 속도를 Consumer가 따라가지 못할 때 생기는 지표다.

```text
Consumer Lag = latest offset - current consumer offset
```

| 원인           | 설명                          |
| -------------- | ----------------------------- |
| 처리 로직 병목 | DB, 외부 API, CPU 사용량 증가 |
| Consumer 장애  | 프로세스 다운, 네트워크 문제  |
| Partition 부족 | 병렬 처리 한계                |
| 트래픽 급증    | 이벤트가 순간적으로 몰림      |

#### 대응 방향

| 대응                | 설명                                         |
| ------------------- | -------------------------------------------- |
| Consumer scale-out  | Consumer 인스턴스 수 증가                    |
| Partition 증가      | 병렬 처리 여지 확보                          |
| 처리 로직 최적화    | 배치 처리, DB bulk 처리, 캐시 적용           |
| DLQ 또는 retry 분리 | 실패 메시지 때문에 전체가 밀리지 않도록 분리 |

### 8-2. Hot Partition

특정 key로 이벤트가 몰리면 하나의 Partition에만 부하가 집중될 수 있다.

예를 들어 인기 상품 ID 하나에 요청이 몰리면, 그 상품 이벤트가 한 Partition에 집중될 가능성이 있다.

| 문제                    | 영향                                           |
| ----------------------- | ---------------------------------------------- |
| 특정 Partition lag 증가 | 전체 처리량이 고르게 나오지 않음               |
| Consumer 편중           | 어떤 Consumer는 바쁘고, 어떤 Consumer는 한가함 |

대응은 key 설계를 다시 보거나, 이벤트 키를 더 분산되게 설계하는 방식이 일반적이다.

### 8-3. Rebalance

Consumer Group에 Consumer가 추가되거나 빠지면 Partition 재할당이 발생한다.  
이를 rebalance라고 한다.

| 상황           | 결과                             |
| -------------- | -------------------------------- |
| Consumer 추가  | Partition 재분배                 |
| Consumer 장애  | 남은 Consumer가 Partition 재할당 |
| 그룹 설정 변경 | 소비 흐름 일시 중단 가능         |

rebalance가 잦으면 일시적으로 처리 공백이 생길 수 있으므로, 그룹 구성과 배포 전략을 안정적으로 가져가는 것이 중요하다.

## 9. 장애 상황과 대응

### 9-1. Consumer 장애로 backlog가 쌓이는 경우

#### 상황

- 특정 Consumer 애플리케이션이 다운됨
- Producer는 계속 이벤트를 넣고 있음
- Topic의 일부 Partition에서 lag가 빠르게 증가

#### 영향

- 후속 처리 지연
- 알림, 배송, 통계 적재 등 downstream 작업이 늦어짐

#### 대응

| 단계 | 대응                                                 |
| ---- | ---------------------------------------------------- |
| 1    | Consumer 프로세스 상태와 로그 확인                   |
| 2    | lag 증가 중인 Partition과 Consumer Group 확인        |
| 3    | Consumer 재기동 또는 scale-out                       |
| 4    | backlog가 많으면 배치 처리, 리소스 확장으로 catch-up |

### 9-2. 특정 Partition만 심하게 느린 경우

#### 상황

- 전체 Topic은 정상처럼 보이지만 일부 Partition만 lag가 큼
- 특정 key가 한 Partition으로 집중됨

#### 대응

| 대응                | 설명                             |
| ------------------- | -------------------------------- |
| key 분산 설계       | 특정 값에 치우치지 않도록 조정   |
| Partition 수 재검토 | 병렬 처리 단위 확장              |
| 처리 로직 점검      | 특정 이벤트가 유독 무거운지 확인 |

### 9-3. 트래픽 급증으로 Consumer가 밀리는 경우

#### 상황

- 대규모 이벤트 유입
- Producer는 정상이나 Consumer 처리량이 부족

#### 대응

| 대응               | 설명                                                    |
| ------------------ | ------------------------------------------------------- |
| autoscaling        | Consumer 수 자동 확장                                   |
| 배치 처리          | poll 이후 묶어서 처리                                   |
| 비핵심 소비자 분리 | 꼭 필요한 Consumer와 나중에 처리 가능한 Consumer를 구분 |
| 모니터링 강화      | lag, 처리 시간, 실패율 추적                             |

## 10. Kafka를 사용할 때 기억할 점

### 강점

| 항목        | 설명                                          |
| ----------- | --------------------------------------------- |
| 이벤트 보존 | 일정 기간 저장 가능                           |
| 다중 소비   | 여러 Consumer가 같은 데이터를 독립적으로 활용 |
| 재처리      | offset 기반 replay 가능                       |
| 확장성      | Partition 기반 scale-out                      |

### 주의점

| 항목               | 설명                                           |
| ------------------ | ---------------------------------------------- |
| 중복 처리 가능성   | at-least-once 기반에서는 idempotency 고려 필요 |
| 순서 보장 범위     | Partition 내부에서만 순서 보장                 |
| 운영 난이도        | Broker, Partition, lag, rebalance 관리 필요    |
| 만능 대체재는 아님 | 단순 작업 큐는 다른 MQ가 더 적합할 수 있음     |

## 11. 정리

Kafka의 핵심은 메시지를 "전달하고 끝내는 것"보다, **이벤트를 기록하고 여러 시스템이 재사용할 수 있게 하는 것**에 있다.

다시 요약하면 다음과 같다.

| 질문                   | 짧은 답                                    |
| ---------------------- | ------------------------------------------ |
| Kafka는 무엇인가       | 분산 로그 기반 이벤트 스트리밍 플랫폼      |
| 왜 쓰는가              | 저장, 재처리, 확장성, 다중 소비를 위해     |
| Partition은 무엇인가   | 저장 단위이자 병렬 처리 단위               |
| Offset은 무엇인가      | Consumer가 어디까지 읽었는지 나타내는 위치 |
| 운영에서 중요한 지표는 | consumer lag, rebalance, partition 분포    |

Kafka는 이벤트 기반 시스템을 설계할 때 강력한 기반이 되지만,  
그만큼 "메시지를 어떻게 저장하고, 어떤 단위로 나누고, 어떻게 다시 읽게 할 것인가"를 함께 설계해야 한다.
