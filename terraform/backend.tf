terraform {
  backend "s3" {
    bucket         = "pedidos-infrastructure"
    key            = "pedidos/terraform.tfstate"
    region         = "us-east-1"
    profile       = "trimon-admin"
  }
}