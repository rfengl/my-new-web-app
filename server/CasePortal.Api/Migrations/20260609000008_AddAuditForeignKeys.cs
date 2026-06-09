using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ensure E_UserRole is seeded (required for Anonymous user's RoleId FK)
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM [dbo].[E_UserRole])
                BEGIN
                    INSERT INTO [dbo].[E_UserRole] ([Id],[Code],[Name],[CreatedDate],[CreatedBy],[ModifiedDate],[ModifiedBy])
                    VALUES (1,'ANON','Anonymous',GETUTCDATE(),0,GETUTCDATE(),0),
                           (2,'ADMIN','Admin',GETUTCDATE(),0,GETUTCDATE(),0),
                           (3,'USER','User',GETUTCDATE(),0,GETUTCDATE(),0);
                END");

            // Insert Anonymous user (Id=0) — all audit FKs reference this sentinel
            migrationBuilder.Sql(@"
                SET IDENTITY_INSERT [dbo].[T_User] ON;
                IF NOT EXISTS (SELECT 1 FROM [dbo].[T_User] WHERE [Id] = 0)
                    INSERT INTO [dbo].[T_User]
                        ([Id],[Email],[PasswordHash],[Name],[RoleId],[IsActive],
                         [CreatedDate],[CreatedBy],[ModifiedDate],[ModifiedBy],[CompanyId])
                    VALUES
                        (0,'anonymous@system','','Anonymous',1,0,
                         GETUTCDATE(),0,GETUTCDATE(),0,NULL);
                SET IDENTITY_INSERT [dbo].[T_User] OFF;");

            // Indexes for FK columns
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_Company_CreatedBy",      table: "T_Company",      column: "CreatedBy");
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_Company_ModifiedBy",     table: "T_Company",      column: "ModifiedBy");
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_Membership_CreatedBy",   table: "T_Membership",   column: "CreatedBy");
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_Membership_ModifiedBy",  table: "T_Membership",   column: "ModifiedBy");
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_SubmissionGL_CreatedBy", table: "T_SubmissionGL", column: "CreatedBy");
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_SubmissionGL_ModifiedBy",table: "T_SubmissionGL", column: "ModifiedBy");
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_User_CreatedBy",         table: "T_User",         column: "CreatedBy");
            migrationBuilder.CreateIndex(schema: "dbo", name: "IX_T_User_ModifiedBy",        table: "T_User",         column: "ModifiedBy");

            // Foreign key constraints — all reference T_User.Id, NO ACTION on delete
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_Company_T_User_CreatedBy",      table: "T_Company",      column: "CreatedBy",  principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_Company_T_User_ModifiedBy",     table: "T_Company",      column: "ModifiedBy", principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_Membership_T_User_CreatedBy",   table: "T_Membership",   column: "CreatedBy",  principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_Membership_T_User_ModifiedBy",  table: "T_Membership",   column: "ModifiedBy", principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_SubmissionGL_T_User_CreatedBy", table: "T_SubmissionGL", column: "CreatedBy",  principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_SubmissionGL_T_User_ModifiedBy",table: "T_SubmissionGL", column: "ModifiedBy", principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_User_T_User_CreatedBy",         table: "T_User",         column: "CreatedBy",  principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
            migrationBuilder.AddForeignKey(schema: "dbo", name: "FK_T_User_T_User_ModifiedBy",        table: "T_User",         column: "ModifiedBy", principalSchema: "dbo", principalTable: "T_User", principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_Company_T_User_CreatedBy",       table: "T_Company");
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_Company_T_User_ModifiedBy",      table: "T_Company");
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_Membership_T_User_CreatedBy",    table: "T_Membership");
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_Membership_T_User_ModifiedBy",   table: "T_Membership");
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_SubmissionGL_T_User_CreatedBy",  table: "T_SubmissionGL");
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_SubmissionGL_T_User_ModifiedBy", table: "T_SubmissionGL");
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_User_T_User_CreatedBy",          table: "T_User");
            migrationBuilder.DropForeignKey(schema: "dbo", name: "FK_T_User_T_User_ModifiedBy",         table: "T_User");

            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_Company_CreatedBy",       table: "T_Company");
            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_Company_ModifiedBy",      table: "T_Company");
            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_Membership_CreatedBy",    table: "T_Membership");
            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_Membership_ModifiedBy",   table: "T_Membership");
            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_SubmissionGL_CreatedBy",  table: "T_SubmissionGL");
            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_SubmissionGL_ModifiedBy", table: "T_SubmissionGL");
            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_User_CreatedBy",          table: "T_User");
            migrationBuilder.DropIndex(schema: "dbo", name: "IX_T_User_ModifiedBy",         table: "T_User");
        }
    }
}
