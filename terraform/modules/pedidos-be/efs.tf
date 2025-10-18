resource "aws_efs_file_system" "pedidos_api_efs" {
  tags = {
    Name = "pedidos-api-efs"
  }
}

# Access point to enforce ownership/permissions for n8n files
resource "aws_efs_access_point" "pedidos_ap" {
  file_system_id = aws_efs_file_system.pedidos_api_efs.id

  posix_user {
    # Choose UID/GID that matches your container user (n8n typically runs as node:1000)
    uid = 1000
    gid = 1000
  }

  root_directory {
    path = "/n8n"
    creation_info {
      owner_gid   = 1000
      owner_uid   = 1000
      permissions = "0755"
    }
  }
}

resource "aws_security_group" "pedidos_api_efs_sg" {
  name        = "pedidos-api-efs-sg"
  description = "Allow ECS tasks to access EFS"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    security_groups    = [aws_security_group.pedidos_service_sg.id]
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_efs_mount_target" "pedidos_mount_target" {
  for_each = { for idx, subnet_id in var.subnets : idx => subnet_id } # Convert list to map

  file_system_id = aws_efs_file_system.pedidos_api_efs.id
  subnet_id      = each.value
  security_groups = [aws_security_group.pedidos_api_efs_sg.id]
}
