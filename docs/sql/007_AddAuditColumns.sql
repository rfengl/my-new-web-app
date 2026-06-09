-- 007_AddAuditColumns.sql
-- Adds CreatedBy, CreatedDate (datetime2), ModifiedBy, ModifiedDate to all tables.
-- T_Membership.Date is renamed to CreatedDate and changed from date to datetime2.
-- Run against: TPA database, dbo schema.

USE TPA;
GO

-----------------------------------------------------------------------
-- T_Membership
-----------------------------------------------------------------------

-- 1. Rename Date -> CreatedDate
EXEC sp_rename 'dbo.T_Membership.Date', 'CreatedDate', 'COLUMN';
GO

-- 2. Remove existing DEFAULT on the column (now named CreatedDate)
DECLARE @con NVARCHAR(200);
SELECT @con = dc.name
FROM   sys.default_constraints dc
JOIN   sys.columns c  ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
JOIN   sys.tables  t  ON c.object_id = t.object_id
JOIN   sys.schemas s  ON t.schema_id = s.schema_id
WHERE  s.name = 'dbo' AND t.name = 'T_Membership' AND c.name = 'CreatedDate';
IF @con IS NOT NULL
    EXEC ('ALTER TABLE [dbo].[T_Membership] DROP CONSTRAINT [' + @con + ']');
GO

-- 3. Change from date to datetime2 (populate with midnight of existing date value)
ALTER TABLE [dbo].[T_Membership]
    ALTER COLUMN [CreatedDate] datetime2 NOT NULL;
GO

-- 4. Add new audit columns
ALTER TABLE [dbo].[T_Membership]
    ADD [CreatedBy]    int       NOT NULL DEFAULT 0,
        [ModifiedDate] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [ModifiedBy]   int       NOT NULL DEFAULT 0;
GO

-----------------------------------------------------------------------
-- T_SubmissionGL
-----------------------------------------------------------------------

DECLARE @con NVARCHAR(200);
SELECT @con = dc.name
FROM   sys.default_constraints dc
JOIN   sys.columns c  ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
JOIN   sys.tables  t  ON c.object_id = t.object_id
JOIN   sys.schemas s  ON t.schema_id = s.schema_id
WHERE  s.name = 'dbo' AND t.name = 'T_SubmissionGL' AND c.name = 'CreatedDate';
IF @con IS NOT NULL
    EXEC ('ALTER TABLE [dbo].[T_SubmissionGL] DROP CONSTRAINT [' + @con + ']');
GO

ALTER TABLE [dbo].[T_SubmissionGL]
    ALTER COLUMN [CreatedDate] datetime2 NOT NULL;
GO

ALTER TABLE [dbo].[T_SubmissionGL]
    ADD [CreatedBy]    int       NOT NULL DEFAULT 0,
        [ModifiedDate] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [ModifiedBy]   int       NOT NULL DEFAULT 0;
GO

-----------------------------------------------------------------------
-- T_User
-----------------------------------------------------------------------

DECLARE @con NVARCHAR(200);
SELECT @con = dc.name
FROM   sys.default_constraints dc
JOIN   sys.columns c  ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
JOIN   sys.tables  t  ON c.object_id = t.object_id
JOIN   sys.schemas s  ON t.schema_id = s.schema_id
WHERE  s.name = 'dbo' AND t.name = 'T_User' AND c.name = 'CreatedDate';
IF @con IS NOT NULL
    EXEC ('ALTER TABLE [dbo].[T_User] DROP CONSTRAINT [' + @con + ']');
GO

ALTER TABLE [dbo].[T_User]
    ALTER COLUMN [CreatedDate] datetime2 NOT NULL;
GO

ALTER TABLE [dbo].[T_User]
    ADD [CreatedBy]    int       NOT NULL DEFAULT 0,
        [ModifiedDate] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [ModifiedBy]   int       NOT NULL DEFAULT 0;
GO

-----------------------------------------------------------------------
-- T_Company
-----------------------------------------------------------------------

DECLARE @con NVARCHAR(200);
SELECT @con = dc.name
FROM   sys.default_constraints dc
JOIN   sys.columns c  ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
JOIN   sys.tables  t  ON c.object_id = t.object_id
JOIN   sys.schemas s  ON t.schema_id = s.schema_id
WHERE  s.name = 'dbo' AND t.name = 'T_Company' AND c.name = 'CreatedDate';
IF @con IS NOT NULL
    EXEC ('ALTER TABLE [dbo].[T_Company] DROP CONSTRAINT [' + @con + ']');
GO

ALTER TABLE [dbo].[T_Company]
    ALTER COLUMN [CreatedDate] datetime2 NOT NULL;
GO

ALTER TABLE [dbo].[T_Company]
    ADD [CreatedBy]    int       NOT NULL DEFAULT 0,
        [ModifiedDate] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [ModifiedBy]   int       NOT NULL DEFAULT 0;
GO
