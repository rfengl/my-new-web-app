-- Migration: 006_CombineIdFields
-- Replaces separate Nric + PassportNo columns with IdType + IdNo on T_Membership.
-- DESTRUCTIVE for existing Nric/PassportNo data — migrate manually if needed before running.
-- Prerequisite: db_owner on [TPA].

USE [TPA];
GO

-- Drop DEFAULT constraints on Nric and PassportNo (handle both named and auto-named)
DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_Membership] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_Membership' AND c.name = 'Nric';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

DECLARE @sql NVARCHAR(500);
SELECT @sql = 'ALTER TABLE [dbo].[T_Membership] DROP CONSTRAINT [' + dc.name + ']'
FROM sys.default_constraints dc JOIN sys.columns c
    ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
WHERE OBJECT_NAME(dc.parent_object_id) = 'T_Membership' AND c.name = 'PassportNo';
IF @sql IS NOT NULL BEGIN EXEC(@sql); SET @sql = NULL; END
GO

-- Drop old columns
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[T_Membership]') AND name = 'Nric')
    ALTER TABLE [dbo].[T_Membership] DROP COLUMN [Nric];
GO
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[T_Membership]') AND name = 'PassportNo')
    ALTER TABLE [dbo].[T_Membership] DROP COLUMN [PassportNo];
GO

-- Add new columns
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[T_Membership]') AND name = 'IdType')
    ALTER TABLE [dbo].[T_Membership]
        ADD [IdType] NVARCHAR(20) NOT NULL CONSTRAINT [DF_T_Membership_IdType] DEFAULT ('NRIC');
GO
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[T_Membership]') AND name = 'IdNo')
    ALTER TABLE [dbo].[T_Membership]
        ADD [IdNo] NVARCHAR(30) NOT NULL CONSTRAINT [DF_T_Membership_IdNo] DEFAULT ('');
GO

-- Record migration
IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = '20260609000005_CombineIdFields')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20260609000005_CombineIdFields', '9.0.0');
GO
