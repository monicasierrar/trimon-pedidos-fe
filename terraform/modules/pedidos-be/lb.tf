


resource "aws_lb" "pedidos_alb" {
  name               = "pedidos-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.pedidos_alb_sg.id]
  subnets            = var.subnets
}

resource "aws_lb_target_group" "pedidos_tg" {
  name        = "pedidos-tg"
  port        = 5678
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" # Use IP-based targeting for Fargate

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "pedidos_http_redirect" {
  load_balancer_arn = aws_lb.pedidos_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "pedidos_https" {
  load_balancer_arn = aws_lb.pedidos_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:105921048477:certificate/981d70bf-528e-4a2d-a3d0-ab87a91fcf72" # aws_acm_certificate.pedidos_lb.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.pedidos_tg.arn
  }
}

resource "aws_acm_certificate" "pedidos_lb" {
  domain_name       = "pedidos-api.trimon.co"                # e.g., pedidos-api-gs.gsierrar.dev
  validation_method = "DNS"

 // subject_alternative_names = var.subject_alternative_names # Optional: for additional domains

  tags = {
    Name = "pedidos-lb-certificate"
  }
}
