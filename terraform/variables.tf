variable "environment" {
  description = "Environment (dev or prod)"
  type        = string
}

variable "fe_subdomain" {
  description = "Subdomain for the application frontend"
  type        = string
}

variable "be_subdomain" {
  description = "Subdomain for the application frontend"
  type        = string
}

variable "hosted_zone_id" {
  description = "Route 53 Hosted Zone ID"
  type        = string
  
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "trimon.co"
  
}
