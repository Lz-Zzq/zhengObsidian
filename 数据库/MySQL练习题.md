# 第一章 SQL
[第一章练习题](D:\User\桌面\MySQL\练习\章节练习)
# 第二章 MySQL安装卸载等
#### 安装好MySQL之后在windows系统中哪些位置能看到MySQL?
- MySQL DBMS软件的安装位置。 D:\develop_tools\MySQL\MySQL Server 8.0
- MySQL 数据库文件的存放位置。 C:\ProgramData\MySQL\MySQL Server 8.0\Data
- MySQL DBMS 的配置文件。 C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
- MySQL的服务（要想通过客户端能够访问MySQL的服务器，必须保证服务是开启状态的）MySQL的path环境变量
#### 卸载MySQL主要卸载哪几个位置的内容？
- 使用控制面板的软件卸载，去卸载MySQL DBMS软件的安装位置。D:\develop_tools\MySQL\MySQL Server 8.0
- 手动删除数据库文件。 C:\ProgramData\MySQL\MySQL Server 8.0\Data
- MySQL的环境变量
- MySQL的服务进入注册表删除。（ regedit ）务必重启电脑
#### MySQL5.7在配置完以后，如何修改配置文件？
为什么要修改my.ini文件？ 默认的数据库使用的字符集是latin1。我们需要修改为：utf8
修改哪些信息？
```sql
[mysql] #大概在63行左右，在其下添加
...
default-character-set=utf8 #默认字符集
[mysqld] # 大概在76行左右，在其下添加
...
character-set-server=utf8
collation-server=utf8_general_ci
```
修改完以后，需要重启服务。

# 第三章 SELECT的基本使用
```sql
# 1.查询员工12个月的工资总和，并起别名为ANNUAL SALARY
SELECT employee_id , last_name,salary * 12 "ANNUAL SALARY" FROM employees;
# 如果算上佣金的话，应该这样计算，并且要避免佣金出现空值，如果佣金为空那么就置为1，保持原样IFNULL判断是否为空，为空则置为0
SELECT employee_id,last_name,salary * 12 * (1 + IFNULL(commission_pct,0)) "ANNUAL SALARY" 
FROM employees;
# 2.查询employees表中去除重复的job_id以后的数据
select DISTINCT job_id from  employees;
# 3.查询工资大于12000的员工姓名和工资
select * from employees where salary > 12000
select * from employees where salary between 12000 and 12000
select * from employees where salary >
# 4.查询员工号为176的员工的姓名和部门号
select last_name,job_id from employees where employee_id = 176
# 5.显示表 departments 的结构，并查询其中的全部数据
desc departments
select * from departments
```
# 第四章 运算符
