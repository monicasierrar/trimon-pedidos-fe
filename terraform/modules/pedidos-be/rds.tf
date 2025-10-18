# resource "aws_db_subnet_group" "main" {
#   name       = "main-db-subnet-group"
#   subnet_ids = var.private_subnets # Replace with your private subnet IDs
#   tags = {
#     Name = "Main DB Subnet Group"
#   }
# }

# resource "aws_security_group" "mysql_ecs_sg" {
#   name        = "mysql-ecs-sg"
#   description = "Allow MySQL access from ECS tasks"
#   vpc_id      = var.vpc_id

#   ingress {
#     description      = "MySQL from ECS"
#     from_port        = 3306
#     to_port          = 3306
#     protocol         = "tcp"
#     security_groups  = [aws_security_group.pedidos_service_sg.id]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "mysql-ecs-sg"
#   }
# }

# resource "aws_db_instance" "pedidos_mysql" {
#   allocated_storage    = 20
#   engine               = "mysql"
#   engine_version       = "8.0"
#   instance_class       = "db.t3.micro"
#   username             = "pedidosuser"
#   password             = "PedidosPass123!"
#   parameter_group_name = "default.mysql8.0"
#   skip_final_snapshot  = true
#   publicly_accessible  = false
#   vpc_security_group_ids = [aws_security_group.mysql_ecs_sg.id]
#   db_subnet_group_name = aws_db_subnet_group.main.name
#   tags = {
#     Name = "n8n-mysql-db"
#   }
# }

# # output "pedidos_mysql_endpoint" {
# #   value = aws_db_instance.pedidos_mysql.endpoint
# # }
# # output "pedidos_mysql_username" {
# #   value = aws_db_instance.pedidos_mysql.username
# # }
# # output "pedidos_mysql_db_name" {
# #   value = aws_db_instance.pedidos_mysql.name
# # }