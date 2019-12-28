--- Create DB User and assign privileges, if not already created.
SQL> alter session set "_ORACLE_SCRIPT"=true; ---- Solution for ORA ERROR: ORA-65096
SQL> create user cq_di identified by XXXXX default tablespace users temporary TABLESPACE temp profile default;
SQL> GRANT CONNECT, RESOURCE TO CQ_DI;

--- Create Dev Tables required for this project.
--------------------------------------------
----- DEV_ENV_APPL Table Script.
--------------------------------------------
SQL> CREATE TABLE DEV_ENV_APPL( ID NUMBER PRIMARY KEY, ENVIRONMENT_NAME VARCHAR2(20) NOT NULL, APPLICATION_NAME VARCHAR2(50) NOT NULL);
--------------------------------------------
----- DEV_ENV_APPL_SEQ SEQUENCE Script.
--------------------------------------------
SQL> CREATE SEQUENCE DEV_ENV_APPL_SEQ START WITH 1 INCREMENT BY 1 NOMAXVALUE;
--------------------------------------------
----- DEV_ENV_APPL_TRG TRIGGER Script.
--------------------------------------------
CREATE TRIGGER DEV_ENV_APPL_TRG
BEFORE INSERT ON DEV_ENV_APPL
FOR EACH ROW
   BEGIN
     SELECT DEV_ENV_APPL_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
   END;
--------------------------------------------
----- DEV_ENV_APP_NAME_IDX INDEX Script.
--------------------------------------------
SQL> CREATE UNIQUE INDEX DEV_ENV_APP_NAME_IDX ON DEV_ENV_APPL (environment_name, application_name);

--------------------------------------------
--- DEV1_CONFIG_DATA TABLE Script.
--------------------------------------------
CREATE TABLE DEV1_CONFIG_DATA(
ID NUMBER PRIMARY KEY,
APPLICATION_NAME VARCHAR2(50) NOT NULL,
SUB_APPLICATION_NAME VARCHAR2(50),
SOURCE_APPLICATION VARCHAR2(50),
TARGET_APPLICATION VARCHAR2(50),
APPL_SERVICE_NAME VARCHAR2(100) NOT NULL,
APPL_SERVICE_NAME_VERSION VARCHAR2(150),
APPL_SERVICE_TYPE VARCHAR2(20) NOT NULL,
APPL_SERVICE_STATUS VARCHAR2(15) NOT NULL,
APPL_SERVICE_STATUS_INFO VARCHAR2(4000),
APPL_CONFIGURATION_URL VARCHAR2(100),
APPL_CREDS_BASE64 VARCHAR2(150),
APPL_PACKAGE_NAME VARCHAR2(50),
INFO_ENTRYDATE DATE NOT NULL,
APPL_DOWNTIME_ENTRY NUMBER DEFAULT 0,
APPL_DOWNTIME_STARTDATE DATE,
APPL_DOWNTIME_ENDDATE DATE,
APPL_SERVICE_CONF_LASTCHANGED DATE
);
--------------------------------------------
----- DEV1_CONFIG_DATA_SEQ SEQUENCE Script.
--------------------------------------------
SQL> CREATE SEQUENCE DEV1_CONFIG_DATA_SEQ START WITH 1 INCREMENT BY 1 NOMAXVALUE;
--------------------------------------------
----- DEV1_CONFIG_DATA_TRG TRIGGER Script.
--------------------------------------------
CREATE TRIGGER DEV1_CONFIG_DATA_TRG
BEFORE INSERT ON DEV1_CONFIG_DATA
FOR EACH ROW
   BEGIN
     SELECT DEV1_CONFIG_DATA_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
   END;
--------------------------------------------
----- DEV1_CONFIG_DATA_IDX INDEX Script.
--------------------------------------------
SQL> CREATE UNIQUE INDEX DEV1_CONFIG_DATA_IDX ON DEV1_CONFIG_DATA (APPLICATION_NAME, SUB_APPLICATION_NAME, APPL_SERVICE_NAME, APPL_SERVICE_TYPE, APPL_CONFIGURATION_URL);

--------------------------------------------
--- DEV2_CONFIG_DATA TABLE Script.
--------------------------------------------
CREATE TABLE DEV2_CONFIG_DATA(
ID NUMBER PRIMARY KEY,
APPLICATION_NAME VARCHAR2(50) NOT NULL,
SUB_APPLICATION_NAME VARCHAR2(50),
SOURCE_APPLICATION VARCHAR2(50),
TARGET_APPLICATION VARCHAR2(50),
APPL_SERVICE_NAME VARCHAR2(100) NOT NULL,
APPL_SERVICE_NAME_VERSION VARCHAR2(150),
APPL_SERVICE_TYPE VARCHAR2(20) NOT NULL,
APPL_SERVICE_STATUS VARCHAR2(15) NOT NULL,
APPL_SERVICE_STATUS_INFO VARCHAR2(4000),
APPL_CONFIGURATION_URL VARCHAR2(100),
APPL_CREDS_BASE64 VARCHAR2(150),
APPL_PACKAGE_NAME VARCHAR2(50),
INFO_ENTRYDATE DATE NOT NULL,
APPL_DOWNTIME_ENTRY NUMBER DEFAULT 0,
APPL_DOWNTIME_STARTDATE DATE,
APPL_DOWNTIME_ENDDATE DATE,
APPL_SERVICE_CONF_LASTCHANGED DATE
);
--------------------------------------------
----- DEV2_CONFIG_DATA_SEQ SEQUENCE Script.
--------------------------------------------
SQL> CREATE SEQUENCE DEV2_CONFIG_DATA_SEQ START WITH 1 INCREMENT BY 1 NOMAXVALUE;
--------------------------------------------
----- DEV2_CONFIG_DATA_TRG TRIGGER Script.
--------------------------------------------
CREATE TRIGGER DEV2_CONFIG_DATA_TRG
BEFORE INSERT ON DEV2_CONFIG_DATA
FOR EACH ROW
   BEGIN
     SELECT DEV2_CONFIG_DATA_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
   END;
--------------------------------------------
----- DEV2_CONFIG_DATA_IDX INDEX Script.
--------------------------------------------
SQL> CREATE UNIQUE INDEX DEV2_CONFIG_DATA_IDX ON DEV2_CONFIG_DATA (APPLICATION_NAME, SUB_APPLICATION_NAME, APPL_SERVICE_NAME, APPL_SERVICE_TYPE, APPL_CONFIGURATION_URL);

--------------------------------------------
--- DEV1_DB_CONFIG_DATA TABLE Script.
--------------------------------------------

CREATE TABLE DEV1_DB_CONFIG_DATA(
ID NUMBER PRIMARY KEY,
APPLICATION_NAME VARCHAR2(50) NOT NULL,
APPL_DATABASE_NAME VARCHAR2(20) NOT NULL,
APPL_SERVICE_NAME VARCHAR2(100) NOT NULL,
APPL_SERVICE_TYPE VARCHAR2(20) NOT NULL,
APPL_SERVICE_STATUS VARCHAR2(15) NOT NULL,
APPL_SERVICE_STATUS_INFO VARCHAR2(4000),
APPL_DB_SERVICE_DETAILS VARCHAR2(50),
APPL_CREDS_BASE64 VARCHAR2(150),
APPL_DB_PACKAGE_NAME VARCHAR2(50),
INFO_ENTRYDATE DATE NOT NULL,
APPL_DOWNTIME_ENTRY NUMBER DEFAULT 0,
APPL_DOWNTIME_STARTDATE DATE,
APPL_DOWNTIME_ENDDATE DATE,
APPL_SERVICE_CONF_LASTCHANGED DATE
);
--------------------------------------------
----- DEV1_DB_CONFIG_DATA_SEQ SEQUENCE Script.
--------------------------------------------
SQL> CREATE SEQUENCE DEV1_DB_CONFIG_DATA_SEQ START WITH 1 INCREMENT BY 1 NOMAXVALUE;
--------------------------------------------
----- DEV1_DB_CONFIG_DATA_TRG TRIGGER Script.
--------------------------------------------
CREATE TRIGGER DEV1_DB_CONFIG_DATA_TRG
BEFORE INSERT ON DEV1_DB_CONFIG_DATA
FOR EACH ROW
   BEGIN
     SELECT DEV1_DB_CONFIG_DATA_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
   END;
--------------------------------------------
----- DEV1_DB_CONFIG_DATA_IDX INDEX Script.
--------------------------------------------
SQL> CREATE UNIQUE INDEX DEV1_DB_CONFIG_DATA_IDX ON DEV1_DB_CONFIG_DATA(APPLICATION_NAME, APPL_DATABASE_NAME, APPL_SERVICE_NAME, APPL_SERVICE_TYPE, APPL_DB_SERVICE_DETAILS, APPL_DB_PACKAGE_NAME);

--------------------------------------------
--- DEV2_DB_CONFIG_DATA TABLE Script.
--------------------------------------------

CREATE TABLE DEV2_DB_CONFIG_DATA(
ID NUMBER PRIMARY KEY,
APPLICATION_NAME VARCHAR2(50) NOT NULL,
APPL_DATABASE_NAME VARCHAR2(20) NOT NULL,
APPL_SERVICE_NAME VARCHAR2(100) NOT NULL,
APPL_SERVICE_TYPE VARCHAR2(20) NOT NULL,
APPL_SERVICE_STATUS VARCHAR2(15) NOT NULL,
APPL_SERVICE_STATUS_INFO VARCHAR2(4000),
APPL_DB_SERVICE_DETAILS VARCHAR2(50),
APPL_CREDS_BASE64 VARCHAR2(150),
APPL_DB_PACKAGE_NAME VARCHAR2(50),
INFO_ENTRYDATE DATE NOT NULL,
APPL_DOWNTIME_ENTRY NUMBER DEFAULT 0,
APPL_DOWNTIME_STARTDATE DATE,
APPL_DOWNTIME_ENDDATE DATE,
APPL_SERVICE_CONF_LASTCHANGED DATE
);
--------------------------------------------
----- DEV2_DB_CONFIG_DATA_SEQ SEQUENCE Script.
--------------------------------------------
SQL> CREATE SEQUENCE DEV2_DB_CONFIG_DATA_SEQ START WITH 1 INCREMENT BY 1 NOMAXVALUE;
--------------------------------------------
----- DEV2_DB_CONFIG_DATA_TRG TRIGGER Script.
--------------------------------------------
CREATE TRIGGER DEV2_DB_CONFIG_DATA_TRG
BEFORE INSERT ON DEV2_DB_CONFIG_DATA
FOR EACH ROW
   BEGIN
     SELECT DEV2_DB_CONFIG_DATA_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
   END;
--------------------------------------------
----- DEV2_DB_CONFIG_DATA_IDX INDEX Script.
--------------------------------------------
SQL> CREATE UNIQUE INDEX DEV2_DB_CONFIG_DATA_IDX ON DEV2_DB_CONFIG_DATA(APPLICATION_NAME, APPL_DATABASE_NAME, APPL_SERVICE_NAME, APPL_SERVICE_TYPE, APPL_DB_SERVICE_DETAILS, APPL_DB_PACKAGE_NAME);

--- Create Test Tables required for this project.