variable "vpc_id" {
  description = "VPC ID"
}

variable "subnets" {
  description = "List of subnet IDs"
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