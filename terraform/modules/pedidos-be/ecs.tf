locals {
  application_name = "${var.subdomain}${var.environment == "prod" ? "" : "-${var.environment}"}.${var.domain_name}"
}

resource "aws_cloudwatch_log_group" "pedidos_api" {
  name              = "/ecs/pedidos-api"
  retention_in_days = 14
}

resource "aws_ecs_cluster" "pedidos_cluster" {
  name = "pedidos-cluster"
}

resource "aws_ecs_task_definition" "pedidos_api_task" {
  family                   = "pedidos-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "3072"

  container_definitions = jsonencode([
    {
      name      = "pedidos-api"
      image     = "n8nio/n8n:1.111.0" # Updated ECR image
      essential = true
      portMappings = [
        {
          containerPort = 5678
          hostPort      = 5678
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "WEBHOOK_URL"
          value = "https://pedidos-api.trimon.co"
        }
      ],

      # Container-level health check for ECS
      # ECS evaluates this to decide if a container is healthy.
      # Use CMD-SHELL to run a curl against localhost inside the container.
      # healthCheck = {
      #   command     = ["CMD-SHELL", "curl -f http://localhost:5678/ || exit 1"]
      #   interval    = 30
      #   timeout     = 5
      #   retries     = 3
      #   startPeriod = 60
      # },

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/pedidos-api"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
      mountPoints = [
        {
          sourceVolume  = "pedidos-data"
          containerPath = "/home/node/.n8n"
          readOnly      = false
        }
      ],
    }
  ])

  volume {
    name = "pedidos-data" # Matches the mountPoints sourceVolume
    efs_volume_configuration {
      file_system_id     = aws_efs_file_system.pedidos_api_efs.id
      root_directory     = "/" # Access point root_directory will be used if access_point_id provided
      transit_encryption = "ENABLED"
      authorization_config {
        access_point_id = aws_efs_access_point.pedidos_ap.id
        iam             = "ENABLED"
      }
    }
  }

  execution_role_arn = aws_iam_role.pedidos_task_execution_role.arn
  task_role_arn      = aws_iam_role.pedidos_task_execution_role.arn

  depends_on = [aws_cloudwatch_log_group.pedidos_api]

}

resource "aws_ecs_service" "pedidos_service" {
  name                              = "pedidos-service"
  cluster                           = aws_ecs_cluster.pedidos_cluster.id
  task_definition                   = aws_ecs_task_definition.pedidos_api_task.arn
  desired_count                     = 1
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = 60

  network_configuration {
    subnets          = var.subnets
    security_groups  = [aws_security_group.pedidos_service_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.pedidos_tg.arn
    container_name   = "pedidos-api"
    container_port   = 5678
  }

  depends_on = [aws_lb_listener.pedidos_https]
}
