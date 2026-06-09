-- 009_AddAuditForeignKeys.sql
-- Inserts the Anonymous user (Id=0) and adds FK constraints from CreatedBy/ModifiedBy
-- on T_Company, T_Membership, T_SubmissionGL, and T_User to T_User.Id.
-- E_UserRole audit columns intentionally omitted to avoid circular seeding dependency.
-- Run against: TPA database, dbo schema.

USE TPA;
GO

-----------------------------------------------------------------------
-- 1. Seed E_UserRole if empty (required for Anonymous user's RoleId FK)
-----------------------------------------------------------------------

IF NOT EXISTS (SELECT 1 FROM [dbo].[E_UserRole])
BEGIN
    INSERT INTO [dbo].[E_UserRole] ([Id],[Code],[Name],[CreatedDate],[CreatedBy],[ModifiedDate],[ModifiedBy])
    VALUES (1,'ANON','Anonymous',GETUTCDATE(),0,GETUTCDATE(),0),
           (2,'ADMIN','Admin',GETUTCDATE(),0,GETUTCDATE(),0),
           (3,'USER','User',GETUTCDATE(),0,GETUTCDATE(),0);
END
GO

-----------------------------------------------------------------------
-- 2. Insert Anonymous user (Id=0) — sentinel for all audit FK columns
-----------------------------------------------------------------------

SET IDENTITY_INSERT [dbo].[T_User] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[T_User] WHERE [Id] = 0)
    INSERT INTO [dbo].[T_User]
        ([Id],[Email],[PasswordHash],[Name],[RoleId],[IsActive],
         [CreatedDate],[CreatedBy],[ModifiedDate],[ModifiedBy],[CompanyId])
    VALUES
        (0,'anonymous@system','','Anonymous',1,0,
         GETUTCDATE(),0,GETUTCDATE(),0,NULL);
SET IDENTITY_INSERT [dbo].[T_User] OFF;
GO

-----------------------------------------------------------------------
-- 3. Indexes on FK columns
-----------------------------------------------------------------------

CREATE INDEX [IX_T_Company_CreatedBy]       ON [dbo].[T_Company]      ([CreatedBy]);
CREATE INDEX [IX_T_Company_ModifiedBy]      ON [dbo].[T_Company]      ([ModifiedBy]);
CREATE INDEX [IX_T_Membership_CreatedBy]    ON [dbo].[T_Membership]   ([CreatedBy]);
CREATE INDEX [IX_T_Membership_ModifiedBy]   ON [dbo].[T_Membership]   ([ModifiedBy]);
CREATE INDEX [IX_T_SubmissionGL_CreatedBy]  ON [dbo].[T_SubmissionGL] ([CreatedBy]);
CREATE INDEX [IX_T_SubmissionGL_ModifiedBy] ON [dbo].[T_SubmissionGL] ([ModifiedBy]);
CREATE INDEX [IX_T_User_CreatedBy]          ON [dbo].[T_User]         ([CreatedBy]);
CREATE INDEX [IX_T_User_ModifiedBy]         ON [dbo].[T_User]         ([ModifiedBy]);
GO

-----------------------------------------------------------------------
-- 4. Foreign key constraints (NO ACTION on delete)
-----------------------------------------------------------------------

ALTER TABLE [dbo].[T_Company]
    ADD CONSTRAINT [FK_T_Company_T_User_CreatedBy]
        FOREIGN KEY ([CreatedBy])  REFERENCES [dbo].[T_User] ([Id]),
        CONSTRAINT [FK_T_Company_T_User_ModifiedBy]
        FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[T_User] ([Id]);
GO

ALTER TABLE [dbo].[T_Membership]
    ADD CONSTRAINT [FK_T_Membership_T_User_CreatedBy]
        FOREIGN KEY ([CreatedBy])  REFERENCES [dbo].[T_User] ([Id]),
        CONSTRAINT [FK_T_Membership_T_User_ModifiedBy]
        FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[T_User] ([Id]);
GO

ALTER TABLE [dbo].[T_SubmissionGL]
    ADD CONSTRAINT [FK_T_SubmissionGL_T_User_CreatedBy]
        FOREIGN KEY ([CreatedBy])  REFERENCES [dbo].[T_User] ([Id]),
        CONSTRAINT [FK_T_SubmissionGL_T_User_ModifiedBy]
        FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[T_User] ([Id]);
GO

-- Self-referential audit FKs on T_User
ALTER TABLE [dbo].[T_User]
    ADD CONSTRAINT [FK_T_User_T_User_CreatedBy]
        FOREIGN KEY ([CreatedBy])  REFERENCES [dbo].[T_User] ([Id]),
        CONSTRAINT [FK_T_User_T_User_ModifiedBy]
        FOREIGN KEY ([ModifiedBy]) REFERENCES [dbo].[T_User] ([Id]);
GO
