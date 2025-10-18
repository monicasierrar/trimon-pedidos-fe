variable "vpc_id" {
  description = "VPC ID"
}

variable "subnets" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "private_subnets" {
  description = "List of private subnet IDs for RDS"
  type        = list(string)
}

variable "hosted_zone_id" {
  description = "Hosted Zone ID for Route 53"
  type        = string
}

variable "environment" {
  description = "Environment (dev or prod)"
  type        = string
}

variable "subdomain" {
  description = "Domain name for the application"
  type        = string
}

variable "domain_name" {
  description = "domain for the application frontend"
  type        = string
}

variable "db_username" {
  description = "Database admin username"
  type        = string
  default     = "pedidosuser"
}

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "pedidosDB"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage (GB)"
  type        = number
  default     = 20
}
