resource "aws_efs_file_system" "pedidos_efs" {
  lifecycle_policy {
    transition_to_ia = "AFTER_30_DAYS"
  }

  tags = {
    Name = "pedidos-efs"
  }
}

resource "aws_efs_mount_target" "pedidos_mount_target" {
  for_each = { for idx, subnet_id in var.subnets : idx => subnet_id } # Convert list to map

  file_system_id = aws_efs_file_system.pedidos_efs.id
  subnet_id      = each.value
  security_groups = [aws_security_group.pedidos_efs_sg.id]
}

resource "aws_security_group" "pedidos_efs_sg" {
  name        = "pedidos-efs-sg"
  description = "Allow ECS tasks to access EFS"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}