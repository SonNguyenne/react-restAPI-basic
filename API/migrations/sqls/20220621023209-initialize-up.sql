/* Replace with your SQL commands */
create table if not exists class(
    classId integer primary key,
    className varchar
);

create table if not exists student(
    studentId integer primary key,
    studentName varchar,
    studentPhone varchar,
    studentClassId varchar
);

insert into class(classId, className) VALUES ('1950201','Cong Nghe Thong Tin'),('1950421','Bac Si'),('1954124','Ngan Hang'),('1951512','Nha Hang'),('1951222','Cong An');

insert into student(studentId ,studentName,studentPhone ,studentClassId) VALUES ('5190227','Nguyen Ho Thanh Son','0967970238','1950201') ,('5190324','Nguyen Minh Quan','0912430238','1950223') ,('5190436','Pham Tien Dat','0967943258','1950223') , ('5190131','Thai Bao','0967953258','1953501') ,('5190432','Nguyen Anh Tai','0965325238','1953501');