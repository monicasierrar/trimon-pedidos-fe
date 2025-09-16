resource "aws_route53_record" "pedidos_dns" {
  zone_id = var.hosted_zone_id
  name    = "pedidos-api.trimon.co"
  type    = "A"

  alias {
    name                   = aws_lb.pedidos_alb.dns_name
    zone_id                = aws_lb.pedidos_alb.zone_id
    evaluate_target_health = false
  }
}