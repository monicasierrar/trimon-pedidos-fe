resource "random_password" "db" {
  length           = 16
  override_special = "!@#%^&*()-_+=[]{}"
  special          = true
}

resource "aws_secretsmanager_secret" "pedidos_db" {
  name = "${var.subdomain}-pedidos-db-password-${var.environment}"
  tags = {
    Name = "pedidos-db-password-${var.environment}"
  }
}

resource "aws_secretsmanager_secret_version" "pedidos_db_version" {
  secret_id     = aws_secretsmanager_secret.pedidos_db.id
  secret_string = random_password.db.result
}

resource "aws_db_subnet_group" "pedidos_db_subnet_group" {
  name       = "${var.subdomain}-pedidos-db-subnet-group-${var.environment}"
  subnet_ids = var.private_subnets

  tags = {
    Name = "pedidos-db-subnet-group"
  }
}

resource "aws_db_instance" "pedidos_db" {
  identifier             = "${var.subdomain}-pedidos-db-${var.environment}"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  db_name                = var.db_name # initial DB creation
  username               = var.db_username
  password               = random_password.db.result
  db_subnet_group_name   = aws_db_subnet_group.pedidos_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.pedidos_db_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = false
  deletion_protection    = false

  tags = {
    Name = "pedidos-db-${var.environment}"
  }

  # keep short for dev; tune for prod (multi_az etc.)
  multi_az = false

  depends_on = [aws_secretsmanager_secret.pedidos_db]
}

output "pedidos_db_address" {
  value = aws_db_instance.pedidos_db.address
}

output "pedidos_db_identifier" {
  value = aws_db_instance.pedidos_db.id
}
