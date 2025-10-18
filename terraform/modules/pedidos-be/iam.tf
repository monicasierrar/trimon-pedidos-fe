resource "aws_iam_role" "pedidos_task_execution_role" {
  name = "pedidosTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.pedidos_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "efs_client_read_write_policy" {
  role       = aws_iam_role.pedidos_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonElasticFileSystemClientReadWriteAccess"
}

# Inline policy allowing the task role to read the RDS secret in Secrets Manager
resource "aws_iam_role_policy" "pedidos_task_secrets_policy" {
  name = "pedidos-task-secrets-policy"
  role = aws_iam_role.pedidos_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ],
        Resource = [
          aws_secretsmanager_secret.pedidos_db.arn
        ]
      }
    ]
  })

  depends_on = [aws_secretsmanager_secret.pedidos_db]
}
