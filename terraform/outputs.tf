output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "kubectl_config_command" {
  description = "이 명령어를 실행해서 kubectl을 연결하세요"
  value       = "aws eks update-kubeconfig --region ${var.region} --name ${var.cluster_name}"
}