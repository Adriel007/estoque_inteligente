using System;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace EstoqueInteligente.Database
{
    public class DatabaseConnection
    {
        private static string connectionString = "server=localhost; port=3306; database=estoque_db;user id=root;SSL Mode=0";
        public static MySqlConnection GetConnection()
        {
            return new MySqlConnection(connectionString);
        }
    }
}

