---
id: 33
title: "Apache POI"
summary: "Apache POI로 대용량 Excel을 읽고 쓸 때의 메모리 비용, SXSSF/SAX 기반 스트리밍 전략, CSV 대안까지 정리한 노트."
created: 2026-04-05
updated: 2026-04-20
tags:
  - java
  - apache-poi
  - excel
  - xlsx
  - csv
---

# Apache POI

## 한눈에 보기
Apache POI는 Java에서 Excel을 다루는 대표 라이브러리지만, 기본 XSSF 모델은 대용량 파일에서 메모리를 많이 쓴다. 실무에서는 "엑셀 지원 가능 여부"보다 어떤 메모리 모델로 읽고 쓰는지가 더 중요하다.

## 쓰기에서 가장 먼저 봐야 할 것
대량 XLSX 생성의 핵심은 메모리에 모든 row를 쌓지 않는 것이다. `SXSSFWorkbook`은 sliding window 방식으로 일부 row만 메모리에 유지해, 일반 XSSF보다 훨씬 안전하다.

```java
try (SXSSFWorkbook workbook = new SXSSFWorkbook(100);
     OutputStream out = Files.newOutputStream(Path.of("report.xlsx"))) {
    Sheet sheet = workbook.createSheet("report");

    for (int i = 0; i < 10_000; i++) {
        Row row = sheet.createRow(i);
        row.createCell(0).setCellValue("row-" + i);
        row.createCell(1).setCellValue(i);
    }

    workbook.write(out);
    workbook.dispose();
}
```

위 예제에서 `100`은 메모리에 유지할 row 수를 뜻한다. POI API 문서도 이 sliding window 개념을 직접 설명하며, 오래된 row는 flush되어 다시 자유롭게 접근할 수 없다고 안내한다. 즉 메모리를 아끼는 대신 random access 제약을 받아들이는 구조다.

## 읽기에서는 왜 SAX를 검토하는가
대용량 읽기에서는 XSSF 전체 로딩 대신 SAX 이벤트 기반 파서나 `excel-streaming-reader` 같은 래퍼가 유용하다. 이 방식은 메모리 사용량을 낮추는 대신, 한 행씩 순차 처리하는 파이프라인으로 사고해야 한다.

즉 "워크북 전체를 객체 그래프로 올려 두고 탐색"하는 방식보다, "행을 읽자마자 검증하고 처리하고 버린다"는 방식이 더 안전하다. 업로드 파일 적재, 배치 변환, 대량 검증은 대부분 이 방향이 맞다.

## 언제 XSSF, SXSSF, SAX를 고를까
- XSSF: 파일이 작고 셀 스타일 조작이나 랜덤 접근이 중요할 때
- SXSSF: 대용량 XLSX를 생성할 때
- SAX 기반 읽기: 대용량 XLSX를 순차 처리할 때
- `excel-streaming-reader`: SAX를 직접 다루기 싫을 때 절충안

## CSV를 진지하게 대안으로 봐야 하는 이유
참고 자료들이 공통으로 보여 주듯 단순 데이터 전달은 종종 XLSX보다 CSV가 더 빠르고 가볍다. 스타일, 수식, 여러 시트, 셀 포맷이 꼭 필요하지 않다면 CSV가 구현 난이도와 메모리 사용량 모두에서 유리하다.

즉 "사용자가 엑셀로 열 수 있어야 한다"와 "꼭 XLSX여야 한다"는 다르다. Excel 호환 다운로드라는 요구만 있다면 CSV가 더 실용적인 경우가 많다.

## 실무 포인트
- export가 느리면 먼저 포맷 요구사항부터 다시 확인
- XLSX가 필요하면 기본 XSSF 대신 SXSSF부터 검토
- import는 한 줄씩 바로 처리하는 구조로 설계
- 스타일 수와 shared strings가 메모리 사용량에 미치는 영향도 함께 점검
- 임시 파일 정리와 `dispose()` 호출을 잊지 않기

## 정리
POI를 쓸 때는 "Excel을 읽고 쓸 수 있다"에서 끝나면 안 된다. 대용량에서는 XSSF 기본 모델을 바로 쓰지 말고, 쓰기는 SXSSF, 읽기는 SAX 또는 streaming reader, 단순 전달은 CSV까지 함께 비교하는 편이 낫다.

## References
- [Solving Slow Excel Generation using Apache POI](https://andriymz.github.io/misc/apache-poi-slow-excel-generation/#)
- [Baeldung: Working with Microsoft Excel in Java](https://www.baeldung.com/java-microsoft-excel)
- [IntelliJ CPU and memory live charts](https://www.jetbrains.com/help/idea/cpu-and-memory-live-charts.html)
- [POI API: SXSSFWorkbook](https://poi.apache.org/apidocs/dev/org/apache/poi/xssf/streaming/SXSSFWorkbook.html)
- [OKKY: 대용량 ROW 엑셀파일 처리문제](https://okky.kr/questions/348270)
- [Naver blog source 1](https://m.blog.naver.com/windboy83/220657730365)
- [POI How-To: XSSF and SAX](https://poi.apache.org/components/spreadsheet/how-to.html#xssf_sax_api)
- [[JAVA] 대용량 엑셀 업로드 기능 구현](https://velog.io/@jonghne/1ouzapm0)
- [Naver blog source 2](https://blog.naver.com/hyoun1202/220245067954)
- [Naver blog source 3](https://blog.naver.com/kim-stone/222281824906)
- [excel-streaming-reader](https://github.com/monitorjbl/excel-streaming-reader)
- [CSV vs XLSX](https://a1office.co/csv-vs-xlsx-difference-and-the-better-format/)
- [FastExcel](https://zetcode.com/java/fastexcel/)
