package com.axher.backend;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import lombok.RequiredArgsConstructor;


@EnableScheduling
@SpringBootApplication
@RequiredArgsConstructor
public class AxherBackendApplication implements CommandLineRunner {

	private final DataSource dataSource;

	public static void main(String[] args) {
		System.out.println("Iniciando aplicacion");
		SpringApplication.run(AxherBackendApplication.class, args);
	}

	@Override
	public void run(String... args){

		System.out.println("Verificando conexion a la base de datos...");

		try(Connection connection = dataSource.getConnection()){
			
			if(connection != null && !connection.isClosed()){
				System.out.println("Conectado exitosamente a la base de datos");
			}else{
				System.out.println("No se pudo establecer la conexion a la base de datos");
			}
		}catch(SQLException e){
			System.out.println("Error al conectar a la base de datos: " + e.getMessage());
			e.printStackTrace();
		}
		System.out.println("Verificacion de conexion completada con la base de datos");
	}


}
