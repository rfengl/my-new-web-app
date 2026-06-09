-- Migration: 002_AddUserTable
-- Run as a user with db_owner on [TPA] (e.g. sa, or: ALTER ROLE db_owner ADD MEMBER rfeng)
-- Idempotent: wrapped in IF NOT EXISTS

USE [TPA];
GO

-- T_User
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[T_User]') AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[T_User] (
        [Id]           NVARCHAR(20)  NOT NULL,
        [Email]        NVARCHAR(200) NOT NULL,
        [PasswordHash] NVARCHAR(500) NOT NULL,
        [Name]         NVARCHAR(200) NOT NULL,
        [Role]         NVARCHAR(50)  NOT NULL CONSTRAINT [DF_T_User_Role]        DEFAULT ('User'),
        [IsActive]     BIT           NOT NULL CONSTRAINT [DF_T_User_IsActive]    DEFAULT (1),
        [CreatedDate]  NVARCHAR(10)  NOT NULL CONSTRAINT [DF_T_User_CreatedDate] DEFAULT (''),
        CONSTRAINT [PK_T_User] PRIMARY KEY CLUSTERED ([Id] ASC)
    );

    CREATE UNIQUE NONCLUSTERED INDEX [UX_T_User_Email] ON [dbo].[T_User] ([Email] ASC);
END
GO

-- Record migration in EF history table (creates table if missing)
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]') AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[__EFMigrationsHistory] (
        [MigrationId]    NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32)  NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[__EFMigrationsHistory] WHERE [MigrationId] = '20260609000001_AddUserTable')
    INSERT INTO [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20260609000001_AddUserTable', '9.0.0');
GO
