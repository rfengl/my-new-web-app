using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CasePortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "T_User",
                schema: "dbo",
                columns: table => new
                {
                    Id           = table.Column<string>(type: "nvarchar(20)",  maxLength: 20,  nullable: false),
                    Email        = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Name         = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Role         = table.Column<string>(type: "nvarchar(50)",  maxLength: 50,  nullable: false, defaultValue: "User"),
                    IsActive     = table.Column<bool>  (type: "bit",                           nullable: false, defaultValue: true),
                    CreatedDate  = table.Column<string>(type: "nvarchar(10)",  maxLength: 10,  nullable: false, defaultValue: ""),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_User", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_User_Email",
                schema: "dbo",
                table: "T_User",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "T_User", schema: "dbo");
        }
    }
}
