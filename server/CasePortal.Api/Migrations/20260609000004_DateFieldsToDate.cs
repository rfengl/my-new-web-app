using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class DateFieldsToDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // T_Membership
            migrationBuilder.AlterColumn<DateOnly>(name: "Date",            schema: "dbo", table: "T_Membership",   type: "date", nullable: false, oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10);
            migrationBuilder.AlterColumn<DateOnly>(name: "PolicyEffDate",   schema: "dbo", table: "T_Membership",   type: "date", nullable: true,  oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10, oldNullable: true);
            migrationBuilder.AlterColumn<DateOnly>(name: "PolicyExpDate",   schema: "dbo", table: "T_Membership",   type: "date", nullable: true,  oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10, oldNullable: true);
            migrationBuilder.AlterColumn<DateOnly>(name: "PolicyLapseDate", schema: "dbo", table: "T_Membership",   type: "date", nullable: true,  oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10, oldNullable: true);

            // T_SubmissionGL
            migrationBuilder.AlterColumn<DateOnly>(name: "BillingDate",     schema: "dbo", table: "T_SubmissionGL", type: "date", nullable: true,  oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10, oldNullable: true);
            migrationBuilder.AlterColumn<DateOnly>(name: "DateOfAdmission", schema: "dbo", table: "T_SubmissionGL", type: "date", nullable: true,  oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10, oldNullable: true);
            migrationBuilder.AlterColumn<DateOnly>(name: "DateOfDischarge", schema: "dbo", table: "T_SubmissionGL", type: "date", nullable: true,  oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10, oldNullable: true);
            migrationBuilder.AlterColumn<DateOnly>(name: "CreatedDate",     schema: "dbo", table: "T_SubmissionGL", type: "date", nullable: false, oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10);

            // T_User
            migrationBuilder.AlterColumn<DateOnly>(name: "CreatedDate", schema: "dbo", table: "T_User",    type: "date", nullable: false, oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10);

            // T_Company
            migrationBuilder.AlterColumn<DateOnly>(name: "CreatedDate", schema: "dbo", table: "T_Company", type: "date", nullable: false, oldClrType: typeof(string), oldType: "nvarchar(10)", oldMaxLength: 10);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(name: "Date",            schema: "dbo", table: "T_Membership",   type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date");
            migrationBuilder.AlterColumn<string>(name: "PolicyEffDate",   schema: "dbo", table: "T_Membership",   type: "nvarchar(10)", maxLength: 10, nullable: true,  defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date", oldNullable: true);
            migrationBuilder.AlterColumn<string>(name: "PolicyExpDate",   schema: "dbo", table: "T_Membership",   type: "nvarchar(10)", maxLength: 10, nullable: true,  defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date", oldNullable: true);
            migrationBuilder.AlterColumn<string>(name: "PolicyLapseDate", schema: "dbo", table: "T_Membership",   type: "nvarchar(10)", maxLength: 10, nullable: true,  defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date", oldNullable: true);
            migrationBuilder.AlterColumn<string>(name: "BillingDate",     schema: "dbo", table: "T_SubmissionGL", type: "nvarchar(10)", maxLength: 10, nullable: true,  defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date", oldNullable: true);
            migrationBuilder.AlterColumn<string>(name: "DateOfAdmission", schema: "dbo", table: "T_SubmissionGL", type: "nvarchar(10)", maxLength: 10, nullable: true,  defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date", oldNullable: true);
            migrationBuilder.AlterColumn<string>(name: "DateOfDischarge", schema: "dbo", table: "T_SubmissionGL", type: "nvarchar(10)", maxLength: 10, nullable: true,  defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date", oldNullable: true);
            migrationBuilder.AlterColumn<string>(name: "CreatedDate",     schema: "dbo", table: "T_SubmissionGL", type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date");
            migrationBuilder.AlterColumn<string>(name: "CreatedDate",     schema: "dbo", table: "T_User",         type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date");
            migrationBuilder.AlterColumn<string>(name: "CreatedDate",     schema: "dbo", table: "T_Company",      type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "", oldClrType: typeof(DateOnly), oldType: "date");
        }
    }
}
