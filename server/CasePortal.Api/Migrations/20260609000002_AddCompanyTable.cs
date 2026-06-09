using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "T_Company",
                schema: "dbo",
                columns: table => new
                {
                    Id          = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false),
                    Name        = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Code        = table.Column<string>(type: "nvarchar(50)",  maxLength: 50,  nullable: false, defaultValue: ""),
                    IsActive    = table.Column<bool>  (type: "bit",                           nullable: false, defaultValue: true),
                    CreatedDate = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Company", x => x.Id);
                });

            migrationBuilder.AddColumn<string>(
                name:      "CompanyId",
                schema:    "dbo",
                table:     "T_User",
                type:      "nvarchar(20)",
                maxLength: 20,
                nullable:  true);

            migrationBuilder.CreateIndex(
                name:   "IX_T_User_CompanyId",
                schema: "dbo",
                table:  "T_User",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name:            "FK_T_User_T_Company_CompanyId",
                schema:          "dbo",
                table:           "T_User",
                column:          "CompanyId",
                principalSchema: "dbo",
                principalTable:  "T_Company",
                principalColumn: "Id",
                onDelete:        ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_T_User_T_Company_CompanyId", schema: "dbo", table: "T_User");
            migrationBuilder.DropIndex(name: "IX_T_User_CompanyId", schema: "dbo", table: "T_User");
            migrationBuilder.DropColumn(name: "CompanyId", schema: "dbo", table: "T_User");
            migrationBuilder.DropTable(name: "T_Company", schema: "dbo");
        }
    }
}
