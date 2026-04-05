- https://jizero-study.tistory.com/43
- https://web-km.tistory.com/42
- https://www.baeldung.com/database-auditing-jpa
- https://docs.spring.io/spring-data/jpa/docs/1.7.0.DATAJPA-580-SNAPSHOT/reference/html/auditing.html
- https://medium.com/@manika09singh/enable-auditing-using-spring-data-jpa-2f62587ccb23

- extended value method로 set을 했더니 audit override 되어서 변수 별도로 지정함 (upd_id)
```java
package com.flo.mcp.scheduler.domain.stake;  
  
import com.flo.mcp.scheduler.domain.common.Auditable;  
import com.flo.mcp.scheduler.domain.stake.enums.ProcessStatusType;  
import com.flo.mcp.scheduler.domain.stake.enums.RegType;  
import com.flo.mcp.scheduler.domain.stake.enums.RightsType;  
import jakarta.persistence.*;  
import java.time.LocalDateTime;  
import lombok.AccessLevel;  
import lombok.Getter;  
import lombok.NoArgsConstructor;  
  
@Getter  
@Entity  
@NoArgsConstructor(access = AccessLevel.PROTECTED)  
@Table(name = "tncr_stake_req")  
public class StakeReq extends Auditable {  
  
  @Id  
  @GeneratedValue(strategy = GenerationType.IDENTITY)  
  private Long stakeReqId;  
  
  private Long rhId;  
  
  private String stakeReqType; // stakeRequest, stakeTrackManagement  
  
  @Enumerated(EnumType.STRING)  
  private RightsType rightsType;  
  
  @Enumerated(EnumType.STRING)  
  private ProcessStatusType processStatus;  
  
  @Enumerated(EnumType.STRING)  
  private RegType regType;  
  
  private String regContent;  
  private String memo;  
  
  private String verifyId;  
  private LocalDateTime verifyDt;  
  
  private String updId;  
  
  public void approve() {  
    processStatus = ProcessStatusType.REQUEST_VERIFY;  
    verifyId = "#batchScheduler";  
    verifyDt = LocalDateTime.now();  
    updId = "#batchScheduler";  
  }  
  
  public void changeProcessStatus(ProcessStatusType processStatus) {  
    this.processStatus = processStatus;  
    this.updId = "#batchScheduler";  
  }  
}
```
