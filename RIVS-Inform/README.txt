http://192.168.15.245 (rivs-inform.com)
---------------------------------------------------------
����� ������������ � ����� ��������� � localstorage.
��� �������� �������� ��������� ������������ ����� ������������,
������������ ������ �����������, ��������� ������������,
������ ��������� ������� ����������� � ������,
� ���� ���������� ��������� ������� �������� � ������.
����� ������������ ���������� ����, ������ ����������� � ������ ������� �����������,
������� ���������� ���������.
---------------------------------------------------------
.../allData - post<Enterprise[], ProductElements[], lastDate[]> 
������ ������ ��� ���������� ���������� � ����������
body {
"userLogin": 'login'
}
---------------------------------------------------------
.../measure - post<measures>
������ ���������
body {
"enterpriseName": 'someEnterprise',
"productName": 'someProduct',
"startDate": '',                    <----- ����� ��������� ������ ������
"endDate": ''			<----- ����� ��������� ������ ������
}
������ ����: 'yyyy-dd-MM'
---------------------------------------------------------
.../products - post<ProductElements[]>
������ ��������� ��� �����������
body {
"enterpriseName": 'enterpriseName}'
}
---------------------------------------------------------
.../updateDb - post<SynchroResult>
������ ������������� ��������� �� MariaDb(rt_meas) � SQL Server
body { 
"dateFrom": 'fromDate' <----- ����� ��������� ������ ������ ��� null
}
---------------------------------------------------------
TODO:
-������ ������������ � ���������� excel ���������
-��������� �������
-����������� ���������� �������� ��� ��������
-����������� �������� �� �������
-���������� ������ refresh ��� ����� ���� � ������� ������ ����
-���������� �����������. ����������� refreshToken
---------------------------------------------------------
INFO:
��� ������ �������� ��� IIS ������������ � w3wp;

