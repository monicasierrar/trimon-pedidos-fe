resource "aws_security_group" "pedidos_service_sg" {
  name        = "pedidos-service-sg"
  description = "Allow traffic to ECS backend"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5678
    to_port     = 5678
    protocol    = "tcp"
    security_groups = [aws_security_group.pedidos_alb_sg.id] # Allow traffic from ALB
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "pedidos_alb_sg" {
  name        = "pedidos-alb-sg"
  description = "Allow HTTP and HTTPS traffic to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
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

resource "aws_security_group_rule" "allow_nfs_egress" {
  type              = "egress"
  from_port         = 2049
  to_port           = 2049
  protocol          = "tcp"
  security_group_id = aws_security_group.pedidos_service_sg.id
  source_security_group_id = aws_security_group.pedidos_service_sg.id
}

resource "aws_security_group_rule" "allow_nfs_ingress" {
  type              = "ingress"
  from_port         = 2049
  to_port           = 2049
  protocol          = "tcp"
  security_group_id = aws_security_group.pedidos_service_sg.id
  source_security_group_id = aws_security_group.pedidos_service_sg.id
}